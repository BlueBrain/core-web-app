import { atom, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { GenerativeQA, FilterFieldsType, FilterValues } from '@/types/literature';
import { Filter } from '@/components/Filter/types';

export type BrainRegion = { id: string; title: string };

export type LiteratureAtom = {
  query: string;
  // the selectedQuestionForFilter is the question that the user has selected to filter the results
  selectedQuestionForFilter?: string;
  isFilterPanelOpen: boolean;
  filterValues: FilterValues | null;
};

export type LiteratureOptions = keyof LiteratureAtom;

const literatureAtom = atom<LiteratureAtom>({
  query: '',
  selectedQuestionForFilter: undefined,
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

export { literatureAtom, literatureResultAtom, useLiteratureAtom };
