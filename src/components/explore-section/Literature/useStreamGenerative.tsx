'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { captureException } from '@sentry/nextjs';
import merge from 'lodash/merge';
import reject from 'lodash/reject';
import delay from 'lodash/delay';

import {
  DATA_SEPERATOR,
  ERROR_SEPERATOR,
  STREAM_JSON_DATA_SEPARATOR_REGEX,
  generativeQADTO,
} from './utils/DTOs';
import { updateAndMerge } from './utils';
import { getGenerativeQA } from './api';
import { GenerativeQA, GenerativeQAResponse, GenerativeQADTO } from '@/types/literature';
import { formatDate, isJSON } from '@/util/utils';
import {
  initialParameters,
  literatureAtom,
  literatureResultAtom,
  persistedLiteratureResultAtom,
  questionsParametersAtom,
} from '@/state/literature';
import useNotification from '@/hooks/notifications';

export type DistributiveOmit<TObj, Tkey extends PropertyKey> = TObj extends any
  ? Omit<TObj, Tkey>
  : never;
export type ResultWithoutId = DistributiveOmit<GenerativeQA, 'id'>;

type WithStream = (
  stream: Response
) => Promise<{ type: ParsedResponse; data: GenerativeQAResponse }>;
type ParsedResponse = 'data' | 'error' | null;
type UseStreamGenerativeHookProps = {
  id: string;
  scoped?: boolean;
  onAfterStream?: (result: GenerativeQA) => void;
  itemData: ResultWithoutId;
};

const findQuestionPredicate = (questionId: string) => (o: GenerativeQA) => o.id === questionId;

function useStreamGenerative({
  id,
  scoped,
  onAfterStream,
  itemData,
}: UseStreamGenerativeHookProps) {
  const isStreamingRef = useRef(false);
  const notification = useNotification();
  const updateResult = useSetAtom(literatureResultAtom);
  const updatePersistedResults = useSetAtom(persistedLiteratureResultAtom);
  const [{ controller }, updateLiterature] = useAtom(literatureAtom);
  const [
    { selectedDate, selectedJournals, selectedAuthors, selectedArticleTypes },
    updateParameters,
  ] = useAtom(questionsParametersAtom);

  const signal = controller?.signal;

  const appendAnswer = useCallback(
    (value: string) => updateLiterature((prev) => ({ ...prev, answer: `${prev.answer}${value}` })),
    [updateLiterature]
  );

  // reset prompt will init the literature values to default
  // if we are in contextuel literature then we keep the question in the input
  const resetPrompt = useCallback(
    (clear: boolean = false) => {
      updateParameters(initialParameters);
      updateLiterature((prev) => ({
        ...prev,
        id: null,
        answer: '',
        isGenerating: false,
        controller: undefined,
        query: scoped ? prev.query : '',
      }));
      // remove the qa entry from the datasource if something goes wrong
      if (clear) {
        delay(() => {
          updateResult((PQAs) => reject(PQAs, { id }));
        }, 500);
      }
    },
    [id, scoped, updateLiterature, updateResult, updateParameters]
  );

  // start streaming the answer
  const requestStream = useCallback(
    async ({ question, brainRegionTitle }: { question: string; brainRegionTitle?: string }) => {
      const dataStream = await getGenerativeQA({
        question,
        authors: selectedAuthors,
        journals: selectedJournals,
        articleTypes: selectedArticleTypes,
        brainRegions: brainRegionTitle ? [brainRegionTitle] : undefined,
        fromDate: selectedDate?.gte
          ? formatDate(selectedDate.gte as Date, 'yyyy-MM-dd')
          : undefined,
        endDate: selectedDate?.lte ? formatDate(selectedDate.lte as Date, 'yyyy-MM-dd') : undefined,
        signal,
      });
      return dataStream;
    },
    [selectedArticleTypes, selectedAuthors, selectedDate, selectedJournals, signal]
  );

  // withStream will handle the trucking of the data
  // and also check the type of the first/last chunk
  // if it's error or data, except one case when we have
  // a json at first chunk means there is an error code probably code:1
  const withStream: WithStream = useCallback(
    async (stream: Response) => {
      let type: ParsedResponse = null;
      let data: GenerativeQAResponse;
      let jsonMetadataPart: string = '';
      let stopAppendAnswer = false;

      const reader = stream.body?.getReader();
      const decoder = new TextDecoder();
      let value: Uint8Array | undefined;
      let done: boolean = false;
      let captureErrorAtStart = true;
      if (reader) {
        while (!done) {
          ({ value, done } = await reader.read());
          if (done) break;
          const decodedChunk = decoder.decode(value, { stream: true });
          if (isJSON(decodedChunk) && captureErrorAtStart) {
            type = 'error';
            // normalize the Error to be handle by try/catch block
            jsonMetadataPart = JSON.stringify({
              Error: { ...(JSON.parse(decodedChunk).detail ?? {}) },
            });
            break;
          }
          captureErrorAtStart = false;
          // keep receive streaming until one of the separator captured
          // separator oneOf<data|error>
          if (decodedChunk.search(STREAM_JSON_DATA_SEPARATOR_REGEX) !== -1) {
            stopAppendAnswer = true;
            jsonMetadataPart += decodedChunk;
            continue;
          }
          if (stopAppendAnswer) {
            jsonMetadataPart += decodedChunk;
          } else if (!stopAppendAnswer) {
            appendAnswer(decodedChunk);
          }
        }
        try {
          const splittedStream = jsonMetadataPart.split(STREAM_JSON_DATA_SEPARATOR_REGEX);
          data = JSON.parse(splittedStream.at(-1) ?? '') as GenerativeQAResponse;

          if (!type) {
            if (jsonMetadataPart.match(DATA_SEPERATOR)) type = 'data';
            if (jsonMetadataPart.match(ERROR_SEPERATOR)) type = 'error';
          }

          return { type, data };
        } catch (error) {
          const err = new Error(`Parsing ML metadata ${error}`);
          captureException(err);
          throw err;
        }
      }
      // throw error when no reader can be set from the stream
      throw new Error(`
          It seems there is an error.
          it's likely a glitch on our end.
          Please submit your question using the “feedback” button.
        `);
    },
    [appendAnswer]
  );

  // withTransformer will normalize server data to client format
  const withTransformer = useCallback(
    (parsedMetadata: { type: ParsedResponse; data: GenerativeQAResponse }) => {
      const { type, data } = parsedMetadata;
      const isNotFound = type === 'error' && 'Error' in data;
      return merge(
        {
          ...itemData,
          streamed: true,
        },
        generativeQADTO({
          isNotFound,
          questionId: id,
          question: itemData?.question,
          askedAt: itemData?.askedAt,
          response: isNotFound ? data.Error : data,
        } as GenerativeQADTO)
      );
    },
    [id, itemData]
  );

  // if everything went well then update the entry in the localstorage
  const onTransformComplete = useCallback(
    (result: GenerativeQA) => {
      updatePersistedResults((PQAs) => [...PQAs, result]);
      updateResult((prev) => updateAndMerge(prev, findQuestionPredicate(id), result));
      resetPrompt();
    },
    [id, updateResult, updatePersistedResults, resetPrompt]
  );

  useEffect(() => {
    if (!isStreamingRef.current) {
      (async () => {
        try {
          const response = await requestStream({
            question: itemData.question,
            brainRegionTitle: itemData.brainRegion?.title,
          });
          if (response instanceof Error) {
            throw new Error(`Error from ML backend`);
          }
          if (response) {
            const parsedStreamResponse = await withStream(response);
            const result = withTransformer(parsedStreamResponse);
            onTransformComplete(result);
            onAfterStream?.(result);
          }
        } catch (error) {
          // the error will be either local error throwed by any of the other
          // helper fns or:
          // if the user want to stop receive tokens from the ML backend by using the abort button
          resetPrompt(true);
          // if the user who abort do nothing
          if (signal?.aborted) return;
          return notification.error(
            `It seems there is an error. it's likely a glitch on our end.
            Please submit your question using the “feedback” button.`,
            5,
            'topRight'
          );
        }
      })();
      isStreamingRef.current = true;
    }
  }, [
    signal,
    itemData,
    notification,
    isStreamingRef,
    requestStream,
    withStream,
    withTransformer,
    onTransformComplete,
    resetPrompt,
    onAfterStream,
  ]);
}

export default useStreamGenerative;
