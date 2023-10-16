import { Dispatch, SetStateAction } from 'react';
import { Loadable } from 'jotai/vanilla/utils/loadable';
import {
  TotalHits,
  Aggregations,
  IndexDataValue,
  ZoomRanges,
} from '@/types/explore-section/fields';

import { Filter, GteLteValue } from '@/components/Filter/types';
import { ExploreResource } from '@/types/explore-section/es';

export interface FetchParams {
  id?: string;
  project?: string;
  org?: string;
  rev?: number;
}

export interface SortState {
  field: string;
  order: 'asc' | 'desc' | null;
}

export type ListViewAtomValues = {
  activeColumns: string[];
  aggregations: Loadable<Aggregations>;
  data: Loadable<ExploreResource[] | undefined>;
  filters: Filter[];
  pageSize: number;
  searchString: string;
  sortState: SortState;
  total: Loadable<TotalHits | undefined>;
};

export type ListViewAtoms<T> = {
  [P in keyof T]: [T[P], Dispatch<SetStateAction<T[P]>>];
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

export type CheckListProps = {
  options: {
    checked: string | boolean;
    count: number | null;
    key: string;
  }[];
  renderLength: number;
  handleCheckedChange: (value: string) => void;
  filterField: Filter['field'];
  search: () => JSX.Element;
  loadMoreBtn: () => JSX.Element | null | false;
  defaultRenderLength: number; // Added defaultRenderLength as a prop
};

export type SubSectionCardItem = {
  name: string;
  type: string;
  url: string;
};

export type SingleCard = {
  prefixIcon?: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  image: string;
  items?: SubSectionCardItem[] | null;
};

export type DetailProps = { field: string; className?: string };

export type ResourceInfo = {
  id: string;
  project: string;
  org: string;
  rev?: string | number;
};
