import { atom, useAtom, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { TBrainRegion, TGenerativeQA } from './types';

type TSingleGenerativeQAFilters = {
  categories: string[];
  publicationVerb: 'year' | 'before' | 'after' | 'range';
  publicationDate: string[];
  articleType: 'editorial_notes' | 'articles' | 'peer_review' | 'report';
  journal: string;
  authors: string[];
};
export type TLiteratureAtom = {
  query: string;
  selectedQuestionForFilter?: string;
  isFilterPanelOpen: boolean;
  filters?: TSingleGenerativeQAFilters;
  activeQuestionId?: string;
  selectedBrainRegion?: TBrainRegion;
  selectAllQuestions: boolean;
};

export type TLiteratureOptions = keyof TLiteratureAtom;

const literatureAtom = atom<TLiteratureAtom>({
  query: '',
  selectedQuestionForFilter: undefined,
  isFilterPanelOpen: false,
  activeQuestionId: undefined,
  selectAllQuestions: false,
});

const GENERATIVE_QA_HISTORY_CACHE_KEY = 'lgqa-history';
const literatureResultAtom = atomWithStorage<TGenerativeQA[]>(GENERATIVE_QA_HISTORY_CACHE_KEY, []);

function useLiteratureAtom() {
  const setLiteratureState = useSetAtom(literatureAtom);
  const update = (key: TLiteratureOptions, value: string | boolean) => {
    setLiteratureState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  return update;
}
function useLiteratureResultsAtom() {
  const [QAs, updateResult] = useAtom(literatureResultAtom);
  const update = (newValue: TGenerativeQA) => {
    updateResult([...QAs, newValue]);
  };

  const remove = (id: string) => {
    updateResult(QAs.filter((item) => item.id !== id));
  };
  return { QAs, update, remove };
}

export { literatureAtom, literatureResultAtom, useLiteratureAtom, useLiteratureResultsAtom };
