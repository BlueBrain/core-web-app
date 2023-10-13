import { atom, useAtom, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import isNil from 'lodash/isNil';
import { selectedBrainRegionAtom } from '../brain-regions';
import {
  GenerativeQA,
  FilterFieldsType,
  FilterValues,
  ContextualLiteratureAtom,
  ContextQAItem,
  QuestionParameters,
  Suggestion,
  ArticleTypeSuggestion,
} from '@/types/literature';
import { Filter, GteLteValue } from '@/components/Filter/types';
import { fetchArticleTypes } from '@/components/explore-section/Literature/api';

export type BrainRegion = { id: string; title: string };

export type LiteratureAtom = {
  query: string;
  selectedQuestionForFilter?: string;
  showOnlyBrainRegionQuestions: boolean;
  isFilterPanelOpen: boolean;
  filterValues: FilterValues | null;
  activeQuestionId?: string;
};

export type LiteratureOptions = keyof LiteratureAtom;

const literatureAtom = atom<LiteratureAtom>({
  query: '',
  selectedQuestionForFilter: undefined,
  showOnlyBrainRegionQuestions: false,
  isFilterPanelOpen: false,
  filterValues: null,
});

const GENERATIVE_QA_HISTORY_CACHE_KEY = 'lgqa-history';

const literatureResultAtom = atomWithStorage<GenerativeQA[]>(GENERATIVE_QA_HISTORY_CACHE_KEY, []);
const contextualLiteratureAtom = atom<ContextualLiteratureAtom>({});

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

  const update = (newValue: GenerativeQA) => {
    updateResult([...QAs, newValue]);
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

const useContextualLiteratureAtom = () => {
  const [context, updateContext] = useAtom(contextualLiteratureAtom);

  const update = (
    key: keyof ContextualLiteratureAtom,
    value: string | boolean | ContextQAItem | ContextQAItem[] | undefined | null
  ) =>
    updateContext((prev) => ({
      ...prev,
      [key]: value,
    }));

  return {
    context,
    update,
  };
};

async function getArticleTypes(): Promise<ArticleTypeSuggestion[]> {
  const articleTypeResponse = await fetchArticleTypes();

  return articleTypeResponse.map((articleResponse) => ({
    articleType: articleResponse.article_type,
    docCount: articleResponse.docs_in_db,
  }));
}

const articleTypeSuggestionsAtom = atom<Promise<Suggestion[]>>(async () => {
  try {
    const articleTypeResponse = await getArticleTypes();
    const options = articleTypeResponse.map((type) => ({
      key: type.articleType,
      label: type.articleType,
      value: type.articleType,
    }));
    return options;
  } catch (err) {
    return [];
  }
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

  return (field: keyof QuestionParameters, values: GteLteValue | string[]) =>
    setQuestionParameters((prev) => ({
      ...prev,
      [field]: values,
    }));
}

questionsParametersAtom.debugLabel = 'questionsParametersAtom';
brainRegionQAs.debugLabel = 'brainRegionQAs';
literatureAtom.debugLabel = 'literatureAtom';
literatureResultAtom.debugLabel = 'literatureResultAtom';
contextualLiteratureAtom.debugLabel = 'contextualLiteratureAtom';

export {
  literatureAtom,
  literatureResultAtom,
  contextualLiteratureAtom,
  brainRegionQAs,
  useLiteratureAtom,
  useContextualLiteratureAtom,
  articleTypeSuggestionsAtom,
  questionsParametersAtom,
};
