import { atom, useAtom, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { GenerativeQA } from '@/components/explore-section/Literature/types';

export type BrainRegion = { id: string; title: string };

const GENERATIVE_QA_HISTORY_CACHE_KEY = 'lgqa-history';

type SingleGenerativeQAFilters = {
  categories: string[];
  publicationVerb: 'year' | 'before' | 'after' | 'range';
  publicationDate: string[];
  articleType: 'editorial_notes' | 'articles' | 'peer_review' | 'report';
  journal: string;
  authors: string[];
};

export type LiteratureAtom = {
  query: string;
  // the selectedQuestionForFilter is the question that the user has selected to filter the results
  selectedQuestionForFilter?: string;
  activeQuestionId?: string;
  isFilterPanelOpen: boolean;
  filters?: SingleGenerativeQAFilters;
};

export type LiteratureOptions = keyof LiteratureAtom;

export const literatureAtom = atom<LiteratureAtom>({
  query: '',
  selectedQuestionForFilter: undefined,
  isFilterPanelOpen: false,
});

export const literatureResultAtom = atomWithStorage<GenerativeQA[]>(
  GENERATIVE_QA_HISTORY_CACHE_KEY,
  []
);

export function useLiteratureAtom() {
  const setLiteratureState = useSetAtom(literatureAtom);
  const update = (key: LiteratureOptions, value: string | boolean | null | undefined) => {
    setLiteratureState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return update;
}

export function useLiteratureResultsAtom() {
  const [QAs, updateResult] = useAtom(literatureResultAtom);
  const update = (newValue: GenerativeQA) => {
    updateResult([...QAs, newValue]);
  };

  const remove = (id: string) => {
    updateResult(QAs.filter((item) => item.id !== id));
  };

  return { QAs, update, remove };
}
