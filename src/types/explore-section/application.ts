import { Dispatch, SetStateAction } from 'react';
import { Loadable } from 'jotai/vanilla/utils/loadable';
import {
  TotalHits,
  Aggregations,
  IndexDataValue,
  ZoomRanges,
} from '@/types/explore-section/fields';

import { ExploreSectionResource } from '@/types/explore-section/resources';
import { Filter, GteLteValue } from '@/components/Filter/types';

export interface FetchParams {
  id: string;
  project: string;
  org: string;
}

export interface SortState {
  field: string;
  order: 'asc' | 'desc';
}
export type ListViewAtomValues = {
  aggregations: Loadable<Aggregations>;
  data: Loadable<ExploreSectionResource[] | undefined>;
  filters: Filter[];
  pageSize: number;
  searchString: string;
  sortState: SortState;
  total: Loadable<TotalHits | undefined>;
};

export type ListViewAtomSetters = {
  setFilters: Dispatch<SetStateAction<ListViewAtomValues['filters']>>;
  setSearchString: Dispatch<SetStateAction<ListViewAtomValues['searchString']>>;
  setSortState: Dispatch<SetStateAction<ListViewAtomValues['sortState']>>;
  setPageSize: Dispatch<SetStateAction<ListViewAtomValues['pageSize']>>;
};

export type PlotProps = {
  setSelectedSweeps: (sweeps: string[]) => void;
  metadata?: IndexDataValue;
  sweeps: {
    selectedSweeps: string[];
    previewSweep?: string;
    allSweeps: string[];
    colorMapper: { [key: string]: string };
  };
  dataset: string;
  options: any;
  zoomRanges: ZoomRanges | null;
  onZoom: (zoomRanges: ZoomRanges) => void;
};

export type FilterValues = {
  [field: string]: string | number | string[] | GteLteValue | null;
};
