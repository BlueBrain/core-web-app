'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useSearchParams } from 'next/navigation';
import merge from 'lodash/merge';

import { STREAM_JSON_DATA_SEPARATOR_REGEX, generativeQADTO } from './utils/DTOs';
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
  permanantLiteratureResultAtom,
  questionsParametersAtom,
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
  const updatePResults = useSetAtom(permanantLiteratureResultAtom);
  const selectedBrainRegion = useAtomValue(literatureSelectedBrainRegionAtom);
  const updateLA = useSetAtom(literatureAtom);
  const { selectedDate, selectedJournals, selectedAuthors, selectedArticleTypes } =
    useAtomValue(questionsParametersAtom);
  const [answer, setAnswer] = useState('');

  const chatId = searchParams?.get('chatId');
  const current = QAs.find((o) => o.id === id);

  const resetQuery = useCallback(() => {
    updateLA((prev) => ({
      ...prev,
      isGenerating: false,
      query: '',
    }));
  }, [updateLA]);

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
  }, [
    question,
    selectedArticleTypes,
    selectedAuthors,
    selectedBrainRegion,
    selectedDate,
    selectedJournals,
  ]);

  const withStreamUpdater = useCallback(
    async (stream: Response) => {
      let jsonMetadataPart: string = '';
      let stopAppendAnswer = false;

      const reader = stream.body?.getReader();
      const decoder = new TextDecoder();
      let value: Uint8Array | undefined;
      let done: boolean = false;
      if (reader) {
        while (!done) {
          // eslint-disable-next-line no-await-in-loop
          ({ value, done } = await reader.read());
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
            setAnswer((prev) => `${prev}${decodedChunk}`);
            goToBottom?.();
          }
        }
        try {
          const data = jsonMetadataPart.split(STREAM_JSON_DATA_SEPARATOR_REGEX).at(-1);
          return JSON.parse(data ?? '');
        } catch (error) {
          throw new Error(`Parsing ML metadata ${error}`);
        } finally {
          resetQuery();
        }
      }
      resetQuery();
      throw new Error(`
      It seems there is an error. 
      it's likely a glitch on our end. 
      Please submit your question using the “feedback” button.
    `);
    },
    [goToBottom, resetQuery]
  );

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

  const onStreamCompleted = useCallback(
    (gq: GenerativeQA) => {
      updateResult(updateAndMerge(QAs, predicate(id), gq));
      updatePResults((PQAs) => [...PQAs, gq]);
      updateLA((prev) => ({
        ...prev,
        activeQuestionId: gq.id,
      }));
      goToBottom?.();
    },
    [QAs, id, goToBottom, updatePResults, updateLA, updateResult]
  );

  useEffect(() => {
    if (!streamed && !isStreaming.current && typeof streamed !== 'undefined') {
      (async () => {
        const response = await sendRequest();
        const newGenerativeQA: GenerativeQA = {
          chatId,
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
          response instanceof LiteratureHTTPValidationError ||
          response instanceof LiteratureHTTPServerError ||
          response instanceof TokenThresholdReachedCostumError ||
          response instanceof Error
        ) {
          throw new Error((response as Error).message);
        }
        if (response) {
          if (!response.ok || !response.body) {
            throw new Error(`Error in streaming ${response.statusText}`);
          }
          const paresedStreamResponse = await withStreamUpdater(response);
          const gqa = withStreamTransformer(paresedStreamResponse, newGenerativeQA);
          onStreamCompleted(gqa);
        }
      })();
      isStreaming.current = true;
    }
  }, [
    chatId,
    streamed,
    selectedBrainRegion,
    isStreaming,
    sendRequest,
    withStreamUpdater,
    withStreamTransformer,
    onStreamCompleted,
  ]);

  return {
    answer,
    current,
  };
}

export default useStreamGenerative;
