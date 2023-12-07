import { ReactNode } from 'react';
import { FilterType } from '@/components/Filter/types';
import { DeltaResource } from '@/types/explore-section/resources';

type TableCellAlign = 'left' | 'right' | 'center';
type ExploreFieldConfigStyle = {
  align?: TableCellAlign;
  width?: number;
};

export type ExploreFieldConfig = {
  className?: string;
  esTerms?: EsTermsConfig;
  title: string;
  description?: string;
  filter: FilterType;
  unit?: string;
  render?: {
    esResourceViewFn?: (value: any, record: any, index: number) => ReactNode | any;
    deltaResourceViewFn?: (resource: DetailType) => ReactNode | any;
  };
  sorter?: boolean;
  vocabulary: {
    plural: string;
    singular: string;
  };
  style?: Partial<ExploreFieldConfigStyle>;
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

export type DetailType = DeltaResource<{
  brainConfiguration: {};
  parameter: { coords: { id: string; value: string }; attrs: { id: string; value: string } };
  status: string;
  startedAtTime: string;
  endedAtTime: string;
  completedAt: string;
}>;
