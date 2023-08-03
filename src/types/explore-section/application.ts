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
  order: 'asc' | 'desc' | null;
}

export type ListViewAtomValues = {
  activeColumns: string[];
  aggregations: Loadable<Aggregations>;
  data: Loadable<ExploreSectionResource[] | undefined>;
  filters: Filter[];
  pageSize: number;
  searchString: string;
  sortState: SortState;
  total: Loadable<TotalHits | undefined>;
};

export type ListViewAtoms = {
  activeColumns: [
    ListViewAtomValues['activeColumns'],
    Dispatch<SetStateAction<ListViewAtomValues['activeColumns']>>
  ];
  aggregations: [
    ListViewAtomValues['aggregations'],
    Dispatch<SetStateAction<ListViewAtomValues['aggregations']>>
  ];
  data: [ListViewAtomValues['data'], Dispatch<SetStateAction<ListViewAtomValues['data']>>];
  filters: [ListViewAtomValues['filters'], Dispatch<SetStateAction<ListViewAtomValues['filters']>>];
  pageSize: [
    ListViewAtomValues['pageSize'],
    Dispatch<SetStateAction<ListViewAtomValues['pageSize']>>
  ];
  searchString: [
    ListViewAtomValues['searchString'],
    Dispatch<SetStateAction<ListViewAtomValues['searchString']>>
  ];
  sortState: [
    ListViewAtomValues['sortState'],
    Dispatch<SetStateAction<ListViewAtomValues['sortState']>>
  ];
  total: [ListViewAtomValues['total'], Dispatch<SetStateAction<ListViewAtomValues['total']>>];
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
