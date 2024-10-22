import { Dispatch, SetStateAction } from 'react';
import { Loadable } from 'jotai/vanilla/utils/loadable';
import { IndexDataValue } from '@/types/explore-section/misc';
import { FlattenedExploreESResponse, ExploreResource } from '@/types/explore-section/es';

import { Filter, GteLteValue } from '@/components/Filter/types';
import { Field } from '@/constants/explore-section/fields-config/enums';
import { DataType } from '@/constants/explore-section/list-views';

// defines the source from where the explore data will be retrieved
// SelectedBrainRegion: The data will be filtered based on the selected brain region
// BookmarkedResources: The data will be retrieved by the bookmarked resources
// NoScope: No scope is applied as a result all available resources will be returned
export enum ExploreDataScope {
  NoScope = 'NoScope',
  SelectedBrainRegion = 'SelectedBrainRegion',
  BuildSelectedBrainRegion = 'BuildSelectedBrainRegion',
  BookmarkedResources = 'BookmarkedResources',
}

export interface SortState {
  field: string;
  order: 'asc' | 'desc';
}

export type ListViewAtomValues = {
  activeColumns: string[];
  aggregations: Loadable<FlattenedExploreESResponse<ExploreResource>['aggs']>;
  data: Loadable<ExploreResource[] | undefined>;
  filters: Filter[];
  pageSize: number;
  searchString: string;
  sortState: SortState;
  total: Loadable<FlattenedExploreESResponse<ExploreResource>['total'] | undefined>;
};

export type ListViewAtoms<T> = {
  [P in keyof T]: [T[P], Dispatch<SetStateAction<T[P]>>];
};

export type PlotProps = {
  reset: boolean;
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
};

export type FilterValues = {
  [field: string]: string | number | string[] | GteLteValue | null;
};

export type CheckListProps = {
  options: {
    checked: boolean;
    count: number | null;
    id: string;
    label: string;
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
  type: DataType;
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

export type DetailProps = { field: Field; className?: string };

export type ResourceInfo = {
  id: string;
  project: string;
  org: string;
  rev?: number;
};
