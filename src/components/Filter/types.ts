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

export interface CheckListInferenceFilter extends Omit<BaseFilter, 'type' | 'value'> {
  type: 'checkListInference';
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
  | ValueFilter
  | ValueOrRangeFilter
  | CheckListInferenceFilter
  | BaseFilter;

export type FilterType =
  | 'checkList'
  | 'dateRange'
  | 'valueRange'
  | 'checkListInference'
  | 'valueOrRange'
  | 'search'
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
