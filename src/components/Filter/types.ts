export type AggregationType = 'buckets' | 'stats' | null;

export interface GteLteValue {
  gte: Date | number | null;
  lte: Date | number | null;
}

interface BaseFilter {
  field: string;
  aggregationType: AggregationType;
  type: null;
  value: null;
}

export interface CheckListFilter extends Omit<BaseFilter, 'type' | 'value'> {
  type: 'checkList';
  value: string[];
}

export interface SearchFilter extends Omit<BaseFilter, 'type' | 'value'> {
  type: 'search';
  value: string[];
}

export interface RangeFilter extends Omit<BaseFilter, 'type' | 'value'> {
  type: 'dateRange' | 'valueRange';
  value: GteLteValue;
}

export interface TextFilter extends Omit<BaseFilter, 'type' | 'value'> {
  type: 'text';
  value: string;
}

export interface ValueFilter extends Omit<BaseFilter, 'type' | 'value'> {
  type: 'value';
  value: number | string | null;
}

export interface ValueOrRangeFilter extends Omit<BaseFilter, 'type' | 'value'> {
  type: 'valueOrRange';
  value: number | GteLteValue | null; // "value" | "range" | "all"
}

export type Filter =
  | CheckListFilter
  | SearchFilter
  | RangeFilter
  | TextFilter
  | ValueFilter
  | ValueOrRangeFilter
  | BaseFilter;

export type FilterType =
  | 'checkList'
  | 'dateRange'
  | 'search'
  | 'text'
  | 'valueOrRange'
  | 'valueRange'
  | null;

export type CheckboxOption = {
  checked: string | boolean;
  count: number | null;
  key: string;
};

export type RangeField =
  | {
      max: Date;
      min: Date;
      defaultValue?: {
        gte: Date;
        lte: Date;
      };
    }
  | undefined;

export type Bucket = {
  doc_count: number;
  key: string | number;
  key_as_string?: string;
  label?: string;
};
