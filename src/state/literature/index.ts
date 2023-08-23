import { atom, useAtom, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import isNil from 'lodash/isNil';
import { selectedBrainRegionAtom } from '../brain-regions';
import { GenerativeQA, FilterFieldsType, FilterValues } from '@/types/literature';
import { Filter } from '@/components/Filter/types';

export type BrainRegion = { id: string; title: string };

export type LiteratureAtom = {
  query: string;
  // the selectedQuestionForFilter is the question that the user has selected to filter the results
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

export { literatureAtom, literatureResultAtom, useLiteratureAtom, brainRegionQAs };
