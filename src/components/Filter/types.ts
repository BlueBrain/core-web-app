import { FilterTypeEnum } from '@/types/explore-section/filters';

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
  type: FilterTypeEnum.CheckList;
  value: string[];
}

export interface SearchFilter extends Omit<BaseFilter, 'type' | 'value'> {
  type: FilterTypeEnum.Search;
  value: string[];
}

export interface DateRangeFilter extends Omit<BaseFilter, 'type' | 'value'> {
  type: FilterTypeEnum.DateRange;
  value: GteLteValue;
}

export interface TextFilter extends Omit<BaseFilter, 'type' | 'value'> {
  type: FilterTypeEnum.Text;
  value: string;
}

export interface ValueFilter extends Omit<BaseFilter, 'type' | 'value'> {
  type: FilterTypeEnum.ValueRange;
  value: GteLteValue;
}

export interface ValueOrRangeFilter extends Omit<BaseFilter, 'type' | 'value'> {
  type: FilterTypeEnum.ValueOrRange;
  value: number | GteLteValue | null; // "value" | "range" | "all"
}

export type Filter =
  | CheckListFilter
  | SearchFilter
  | DateRangeFilter
  | TextFilter
  | ValueFilter
  | ValueOrRangeFilter
  | BaseFilter;

export type FilterType = FilterTypeEnum | null;

export type Bucket = {
  doc_count: number;
  key: string | number;
  key_as_string?: string;
  label?: string | { buckets: Bucket[] };
};
