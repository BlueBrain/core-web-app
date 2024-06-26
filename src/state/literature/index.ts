import { atom, useAtom, useSetAtom } from 'jotai';
import { atomFamily, atomWithDefault, atomWithStorage } from 'jotai/utils';
import isNil from 'lodash/isNil';
import isArray from 'lodash/isArray';

import { selectedBrainRegionAtom } from '../brain-regions';
import {
  GenerativeQA,
  FilterFieldsType,
  FilterValues,
  ContextualLiteratureAtom,
  QuestionParameters,
  Suggestion,
} from '@/types/literature';
import { Filter, GteLteValue } from '@/components/Filter/types';

export type BrainRegion = { id: string; title: string };

export type LiteratureAtom = {
  id: string | null;
  query: string;
  answer: string;
  selectedQuestionForFilter?: string;
  showOnlyBrainRegionQuestions: boolean;
  areQAParamsVisible: boolean;
  isFilterPanelOpen: boolean;
  filterValues: FilterValues | null;
  activeQuestionId?: string;
  isGenerating: boolean;
  controller?: AbortController;
};

export type LiteratureOptions = keyof LiteratureAtom;

type PromptResponseNode = {
  id?: string;
  key: string;
  result?: Partial<GenerativeQA>;
};

const literatureAtom = atom<LiteratureAtom>({
  id: null,
  query: '',
  answer: '',
  selectedQuestionForFilter: undefined,
  showOnlyBrainRegionQuestions: false,
  areQAParamsVisible: false,
  isFilterPanelOpen: false,
  filterValues: null,
  isGenerating: false,
});

const GENERATIVE_QA_HISTORY_CACHE_KEY = 'lgqa-history';

export const persistedLiteratureResultAtom = atomWithStorage<GenerativeQA[]>(
  GENERATIVE_QA_HISTORY_CACHE_KEY,
  []
);
export const literatureResultAtom = atomWithDefault((get) => get(persistedLiteratureResultAtom));

const contextualLiteratureAtom = atom<ContextualLiteratureAtom>({});

export const promptResponseNodesAtomFamily = atomFamily(
  ({ result, key, id }: PromptResponseNode) => atom({ id, key, result }),
  (nodeA, nodeB) => nodeA.key === nodeB.key
);

function useLiteratureAtom() {
  const setLiteratureState = useSetAtom(literatureAtom);
  const update = (key: LiteratureOptions, value: string | boolean | null | undefined) => {
    setLiteratureState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  return update;
}

export function useLiteratureFilter() {
  const setLiteratureState = useSetAtom(literatureAtom);

  return (field: FilterFieldsType, values: Filter['value']) =>
    setLiteratureState((prev) => ({
      ...prev,
      filterValues: {
        ...(prev.filterValues ?? {}),
        [field]: values,
      },
    }));
}

export function useLiteratureResultsAtom() {
  const [QAs, updateResult] = useAtom(literatureResultAtom);

  // accept batch update
  const update = (newValue: GenerativeQA | Array<GenerativeQA>) => {
    updateResult([...QAs, ...(isArray(newValue) ? newValue : [newValue])]);
  };

  const remove = (id: string) => {
    const newQAs = QAs.filter((item) => item.id !== id);
    updateResult(newQAs);

    return newQAs;
  };

  return { QAs, update, remove };
}

const brainRegionQAs = atom((get) => {
  const allQuestions = get(literatureResultAtom);

  const selectedBrainRegion = get(selectedBrainRegionAtom);
  const { showOnlyBrainRegionQuestions } = get(literatureAtom);

  return allQuestions.filter((question) =>
    showOnlyBrainRegionQuestions && !isNil(selectedBrainRegion) && !question.isNotFound
      ? question.brainRegion?.id === selectedBrainRegion.id
      : true
  );
});

export const initialParameters: QuestionParameters = {
  selectedDate: { lte: null, gte: null },
  selectedJournals: [],
  selectedAuthors: [],
  selectedArticleTypes: [],
};

const questionsParametersAtom = atom<Partial<QuestionParameters>>(initialParameters);

export function useQuestionParameter() {
  const setQuestionParameters = useSetAtom(questionsParametersAtom);

  return (field: keyof QuestionParameters, values: GteLteValue | Suggestion[] | string[]) =>
    setQuestionParameters((prev) => ({
      ...prev,
      [field]: values,
    }));
}

export {
  literatureAtom,
  contextualLiteratureAtom,
  brainRegionQAs,
  useLiteratureAtom,
  questionsParametersAtom,
};
