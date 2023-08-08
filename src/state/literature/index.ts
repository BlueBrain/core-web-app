import { atom, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { GenerativeQA } from '@/components/explore-section/Literature/types';

export type TBrainRegion = { id: string; title: string };
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
  isFilterPanelOpen: boolean;
  filters?: SingleGenerativeQAFilters;
};

export type LiteratureOptions = keyof LiteratureAtom;

const literatureAtom = atom<LiteratureAtom>({
  query: '',
  selectedQuestionForFilter: undefined,
  isFilterPanelOpen: false,
});

const GENERATIVE_QA_HISTORY_CACHE_KEY = 'lgqa-history';
const literatureResultAtom = atomWithStorage<GenerativeQA[]>(GENERATIVE_QA_HISTORY_CACHE_KEY, []);

function useLiteratureAtom() {
  const setLiteratureState = useSetAtom(literatureAtom);
  const update = (key: LiteratureOptions, value: string | boolean) => {
    setLiteratureState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  return update;
}

export { literatureAtom, literatureResultAtom, useLiteratureAtom };
