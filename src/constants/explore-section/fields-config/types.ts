import { ReactNode } from 'react';
import { FilterType } from '@/components/Filter/types';
import { DeltaResource } from '@/types/explore-section/resources';
import { Experiment } from '@/types/explore-section/es-experiment';

export type ExploreFieldConfig = {
  esTerms?: EsTermsConfig;
  title: string;
  description?: string;
  filter: FilterType;
  unit?: string;
  render?: {
    listingViewFn?: (value: any, record: any, index: number) => ReactNode | any;
    detailViewFn?: (resource: DeltaResource) => ReactNode | any;
    cardViewFn?: (resource: Experiment) => ReactNode | any;
  };
  vocabulary: {
    plural: string;
    singular: string;
  };
};
export type ExploreFieldsConfigProps = {
  [key: string]: ExploreFieldConfig;
};
type EsTermsConfig = {
  flat?: {
    filter?: string;
    aggregation?: string;
    sort?: string;
  };
  nested?: NestedFieldConfig;
};
type NestedFieldConfig = {
  extendedField: string;
  field: string;
  nestField: string;
};
