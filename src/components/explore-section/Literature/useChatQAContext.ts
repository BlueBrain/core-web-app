import { useReducer, useState, useTransition } from 'react';
import { useAtomValue } from 'jotai';
import merge from 'lodash/merge';

import { LiteratureValidationError } from './errors';
import { generativeQADTO } from './utils/DTOs';
import { getGenerativeQAAction } from './actions';
import {
  GenerativeQA,
  GenerativeQAServerResponse,
  GenerativeQAWithDataResponse,
  isGenerativeQA,
  isGenerativeQANoFound,
} from '@/types/literature';
import {
  literatureAtom,
  useLiteratureAtom,
  useContextualLiteratureResultAtom,
  useLiteratureResultsAtom,
} from '@/state/literature';
import { literatureSelectedBrainRegionAtom } from '@/state/brain-regions';
import { GteLteValue } from '@/components/Filter/types';
import { formatDate } from '@/util/utils';

type QuestionParameters = {
  selectedDate: GteLteValue;
  selectedJournals: string[];
  selectedAuthors: string[];
  selectedArticleTypes: string[];
};

export const initialParameters: QuestionParameters = {
  selectedDate: { lte: null, gte: null },
  selectedJournals: [],
  selectedAuthors: [],
  selectedArticleTypes: [],
};

function useChatQAContext({
  afterAskCallback,
  resetAfterAsk = true,
  saveOnContext = false,
}: {
  afterAskCallback?(value: GenerativeQA | null): void;
  resetAfterAsk?: boolean;
  saveOnContext?: boolean;
}) {
  const update = useLiteratureAtom();
  const selectedBrainRegion = useAtomValue(literatureSelectedBrainRegionAtom);
  const { update: updateResults } = useLiteratureResultsAtom();
  const { update: updateContext } = useContextualLiteratureResultAtom();
  const { query } = useAtomValue(literatureAtom);
  const [isPending, startGenerativeQATransition] = useTransition();
  const [isParametersVisible, setIsParametersVisible] = useState(false);
  const [
    { selectedDate, selectedJournals, selectedAuthors, selectedArticleTypes },
    updateParameters,
  ] = useReducer(
    (previous: QuestionParameters, next: Partial<QuestionParameters>) => ({ ...previous, ...next }),
    { ...initialParameters }
  );

  const onValueChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
    update('query', value);
  const onQuestionClear = () => update('query', '');
  const isQuestionEmpty = query.trim().length === 0;

  const onComplete = (
    data: GenerativeQAServerResponse | LiteratureValidationError | null,
    extra?: Record<string, any>
  ) => {
    let newGenerativeQA: GenerativeQA | null = null;

    if (data && !(data instanceof LiteratureValidationError)) {
      newGenerativeQA = generativeQADTO({
        question: data.question,
        isNotFound: isGenerativeQANoFound(data) || !isGenerativeQA(data),
        response: isGenerativeQA(data)
          ? (data.response as GenerativeQAWithDataResponse)
          : undefined,
      });
      if (selectedBrainRegion?.id) {
        newGenerativeQA = merge(newGenerativeQA, {
          brainRegion: {
            id: selectedBrainRegion.id,
            title: selectedBrainRegion.title,
          },
        });
      }

      newGenerativeQA = merge(newGenerativeQA, { extra });

      if (saveOnContext) {
        updateContext(newGenerativeQA);
      }
      updateResults(newGenerativeQA);
      update('activeQuestionId', newGenerativeQA.id);
    }

    if (resetAfterAsk) {
      update('query', '');
    }
    updateParameters({ ...initialParameters });
    setIsParametersVisible(false);
    return newGenerativeQA;
  };

  const send = (data: FormData) =>
    getGenerativeQAAction({
      data,
      keywords: selectedBrainRegion ? [selectedBrainRegion.title] : undefined,
      journals: selectedJournals,
      authors: selectedAuthors,
      articleTypes: selectedArticleTypes,
      fromDate: selectedDate.gte ? formatDate(selectedDate.gte as Date, 'yyyy-MM-dd') : undefined,
      endDate: selectedDate.lte ? formatDate(selectedDate.lte as Date, 'yyyy-MM-dd') : undefined,
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
    isParametersVisible,
    selectedDate,
    selectedJournals,
    selectedAuthors,
    updateParameters,
    setIsParametersVisible,
    onComplete,
    onValueChange,
    onQuestionClear,
    send,
    ask,
  };
}

export type ChatQAContextHook = ReturnType<typeof useChatQAContext>;
export default useChatQAContext;
