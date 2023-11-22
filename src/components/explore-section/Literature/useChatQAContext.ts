import { useTransition } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { useSearchParams } from 'next/navigation';
import merge from 'lodash/merge';

import { LiteratureValidationError } from './errors';
import { generativeQADTO } from './utils/DTOs';
import { getGenerativeQAAction } from './actions';
import { GenerativeQA, GenerativeQADTO, GenerativeQAServerResponse } from '@/types/literature';
import {
  initialParameters,
  literatureAtom,
  questionsParametersAtom,
  useLiteratureAtom,
  useLiteratureResultsAtom,
} from '@/state/literature';
import { literatureSelectedBrainRegionAtom } from '@/state/brain-regions';
import { formatDate } from '@/util/utils';

function useChatQAContext({
  afterAskCallback,
  resetAfterAsk = true,
}: {
  afterAskCallback?(value: GenerativeQA | null): void;
  resetAfterAsk?: boolean;
}) {
  const update = useLiteratureAtom();
  const searchParams = useSearchParams();
  const selectedBrainRegion = useAtomValue(literatureSelectedBrainRegionAtom);
  const { update: updateResults } = useLiteratureResultsAtom();
  const { query } = useAtomValue(literatureAtom);
  const [isPending, startGenerativeQATransition] = useTransition();
  const [
    { selectedDate, selectedJournals, selectedAuthors, selectedArticleTypes },
    updateParameters,
  ] = useAtom(questionsParametersAtom);

  const onValueChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
    update('query', value);
  const onQuestionClear = () => update('query', '');
  const isQuestionEmpty = query.trim().length === 0;

  const onComplete = (
    response: GenerativeQAServerResponse | LiteratureValidationError | null,
    extra?: Record<string, any>
  ) => {
    let newGenerativeQA: GenerativeQA | null = null;

    if (response && !(response instanceof LiteratureValidationError)) {
      newGenerativeQA = generativeQADTO({
        question: response.question,
        isNotFound: !response.success,
        response: response.success ? response.data : response.error,
      } as GenerativeQADTO);

      if (selectedBrainRegion?.id) {
        newGenerativeQA = merge(newGenerativeQA, {
          brainRegion: {
            id: selectedBrainRegion.id,
            title: selectedBrainRegion.title,
          },
        });
      }

      newGenerativeQA = merge(newGenerativeQA, {
        extra,
        chatId: searchParams?.get('chatId'),
      });

      updateResults(newGenerativeQA);
      update('activeQuestionId', newGenerativeQA.id);
    }

    if (resetAfterAsk) {
      update('query', '');
    }

    updateParameters({ ...initialParameters });
    return newGenerativeQA;
  };

  const send = (data: FormData) =>
    getGenerativeQAAction({
      data,
      keywords: selectedBrainRegion ? [selectedBrainRegion.title] : undefined,
      journals: selectedJournals,
      authors: selectedAuthors,
      articleTypes: selectedArticleTypes,
      fromDate: selectedDate?.gte ? formatDate(selectedDate.gte as Date, 'yyyy-MM-dd') : undefined,
      endDate: selectedDate?.lte ? formatDate(selectedDate.lte as Date, 'yyyy-MM-dd') : undefined,
    });

  const ask = (extra?: Record<string, any>) => (data: FormData) => {
    startGenerativeQATransition(async () => {
      const result = await send(data);
      const dto = onComplete(result, extra);
      afterAskCallback?.(dto);
    });
  };

  return {
    query,
    isQuestionEmpty,
    isPending,
    selectedDate,
    selectedJournals,
    selectedAuthors,
    updateParameters,
    onComplete,
    onValueChange,
    onQuestionClear,
    send,
    ask,
  };
}

export type ChatQAContextHook = ReturnType<typeof useChatQAContext>;
export default useChatQAContext;
