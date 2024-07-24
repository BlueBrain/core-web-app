import { ReactNode } from 'react';
import { FilterType } from '@/components/Filter/types';
import { DeltaResource } from '@/types/explore-section/resources';
import { MorphoMetricCompartment } from '@/types/explore-section/es-experiment';

type TableCellAlign = 'left' | 'right' | 'center';

export enum FieldType {
  CellType,
}

type ExploreFieldConfigStyle = {
  align?: TableCellAlign;
  width?: number;
};

export type ExploreFieldConfig<T> = {
  fieldType?: FieldType;
  className?: string;
  esTerms?: EsTermsConfig;
  title: string;
  description?: string;
  filter: FilterType;
  unit?: ReactNode;
  group?: MorphoMetricCompartment;
  render?: {
    esResourceViewFn?: (value: any, record: any, index?: number) => ReactNode | any;
    deltaResourceViewFn?: (resource: T) => ReactNode | any;
  };
  sorter?: boolean;
  vocabulary: {
    plural: string;
    singular: string;
  };
  style?: Partial<ExploreFieldConfigStyle>;
};

export type ExploreFieldsConfigProps<T> = {
  [key: string]: ExploreFieldConfig<T>;
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
  nestedPath: string;
  filterTerm: string;
  filterValue: string;
  aggregationName: string;
  aggregationField: string;
};

export type DetailType = DeltaResource;
