'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useSearchParams } from 'next/navigation';
import merge from 'lodash/merge';

import {
  ANSWER_SOURCE_SEPARATOR,
  STREAM_JSON_DATA_SEPARATOR_REGEX,
  generativeQADTO,
} from './utils/DTOs';
import { updateAndMerge } from './utils';
import {
  LiteratureHTTPServerError,
  LiteratureHTTPValidationError,
  TokenThresholdReachedCostumError,
} from './errors';
import { getGenerativeQA } from './api';
import { GenerativeQA, GenerativeQAResponse, GenerativeQADTO } from '@/types/literature';
import { formatDate } from '@/util/utils';
import {
  literatureAtom,
  literatureResultAtom,
  questionsParametersAtom,
  usePermanantLiteratureResultsAtom,
} from '@/state/literature';
import { literatureSelectedBrainRegionAtom } from '@/state/brain-regions';

const predicate = (questionId: string) => (o: GenerativeQA) => o.id === questionId;

function useStreamGenerative({
  id,
  question,
  askedAt,
  streamed,
  goToBottom,
}: {
  id: string;
  question: string;
  askedAt: Date;
  streamed?: boolean;
  goToBottom?: () => void;
}) {
  const searchParams = useSearchParams();
  const isStreaming = useRef(false);
  const [QAs, updateResult] = useAtom(literatureResultAtom);
  const { update: updatePResults } = usePermanantLiteratureResultsAtom();
  const selectedBrainRegion = useAtomValue(literatureSelectedBrainRegionAtom);
  const updateLA = useSetAtom(literatureAtom);
  const { selectedDate, selectedJournals, selectedAuthors, selectedArticleTypes } =
    useAtomValue(questionsParametersAtom);
  const [answer, setAnswer] = useState('');
  const current = QAs.find((o) => o.id === id);

  const sendRequest = useCallback(async () => {
    const dataStream = await getGenerativeQA({
      question,
      keywords: selectedBrainRegion ? [selectedBrainRegion.title] : undefined,
      journals: selectedJournals,
      authors: selectedAuthors,
      articleTypes: selectedArticleTypes,
      fromDate: selectedDate?.gte ? formatDate(selectedDate.gte as Date, 'yyyy-MM-dd') : undefined,
      endDate: selectedDate?.lte ? formatDate(selectedDate.lte as Date, 'yyyy-MM-dd') : undefined,
    });
    return dataStream;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    id,
    question,
    selectedArticleTypes,
    selectedAuthors,
    selectedBrainRegion,
    selectedDate?.gte,
    selectedDate?.lte,
    selectedJournals,
  ]);

  const withStreamUpdater = useCallback(async (stream: Response) => {
    let jsonMetadataPart: string = '';
    let stopAppendAnswer = false;

    const reader = stream.body?.getReader();
    const decoder = new TextDecoder();
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // eslint-disable-next-line no-await-in-loop
      const { value, done } = await reader!.read();
      if (done) break;
      const decodedChunk = decoder.decode(value, { stream: true });
      if (decodedChunk.search(STREAM_JSON_DATA_SEPARATOR_REGEX) !== -1) {
        stopAppendAnswer = true;
        jsonMetadataPart += decodedChunk;
        // eslint-disable-next-line no-continue
        continue;
      }
      if (stopAppendAnswer) {
        jsonMetadataPart += decodedChunk;
      } else if (!stopAppendAnswer) {
        setAnswer(
          (prev) =>
            `${prev} ${
              // eslint-disable-next-line lodash/prefer-includes
              decodedChunk.indexOf(ANSWER_SOURCE_SEPARATOR) !== -1
                ? decodedChunk.split(ANSWER_SOURCE_SEPARATOR)?.[0]
                : decodedChunk
            }`
        );
        goToBottom?.();
      }
    }
    try {
      return JSON.parse(jsonMetadataPart);
    } catch (error) {
      throw new Error(`Parsing ML metadata ${error}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const withStreamTransformer = useCallback(
    (parsedMetadata: GenerativeQAResponse | null, gqa: GenerativeQA) => {
      let gq = gqa;
      if (parsedMetadata && ('answer' in parsedMetadata || 'raw_answer' in parsedMetadata)) {
        gq = merge(
          gq,
          generativeQADTO({
            question,
            askedAt,
            questionId: id,
            isNotFound: false,
            response: parsedMetadata,
          } as GenerativeQADTO),
          { streamed: true }
        );
      } else if (parsedMetadata && 'detail' in parsedMetadata) {
        gq = merge(
          gq,
          generativeQADTO({
            question,
            askedAt,
            questionId: id,
            isNotFound: true,
            response: parsedMetadata.detail,
          } as GenerativeQADTO),
          { streamed: true }
        );
      }
      return gq;
    },
    [id, question, askedAt]
  );

  const withStreamWrapper = useCallback(
    (gq: GenerativeQA) => {
      updateResult(updateAndMerge(QAs, predicate(id), gq));
      updatePResults(gq);
      updateLA((prev) => ({
        ...prev,
        activeQuestionId: gq.id,
        isGenerating: false,
        query: '',
      }));
      goToBottom?.();
    },
    [QAs, id, goToBottom, updateLA, updatePResults, updateResult]
  );

  useEffect(() => {
    if (!streamed && !isStreaming.current && typeof streamed !== 'undefined') {
      (async () => {
        const response = await sendRequest();
        const newGenerativeQA: GenerativeQA = {
          chatId: searchParams?.get('chatId'),
          ...(selectedBrainRegion && selectedBrainRegion.id
            ? {
                brainRegion: {
                  id: selectedBrainRegion.id,
                  title: selectedBrainRegion.title,
                },
              }
            : {}),
        } as GenerativeQA;

        if (
          // TODO: update the error messages inside Error classes
          response instanceof LiteratureHTTPValidationError ||
          response instanceof LiteratureHTTPServerError ||
          response instanceof TokenThresholdReachedCostumError ||
          response instanceof Error
        ) {
          throw new Error(response.message);
        }
        if (response) {
          if (!response.ok || !response.body) {
            throw new Error(`Error in streaming ${response.statusText}`);
          }
          const paresedStreamResponse = await withStreamUpdater(response);
          const gqa = withStreamTransformer(paresedStreamResponse, newGenerativeQA);
          withStreamWrapper(gqa);
        }
      })();
      isStreaming.current = true;
    }
  }, [
    searchParams,
    streamed,
    QAs,
    selectedBrainRegion,
    isStreaming,
    sendRequest,
    updatePResults,
    updateResult,
    updateLA,
    withStreamUpdater,
    withStreamWrapper,
    withStreamTransformer,
  ]);

  return {
    answer,
    current,
  };
}

export default useStreamGenerative;
