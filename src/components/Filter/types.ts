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

export interface RangeFilter extends Omit<BaseFilter, 'type' | 'value'> {
  type: 'dateRange' | 'valueRange';
  value: GteLteValue;
}

export interface ValueFilter extends Omit<BaseFilter, 'type' | 'value'> {
  type: 'value';
  value: number | string | null;
}

export type Filter = CheckListFilter | RangeFilter | ValueFilter | BaseFilter;

export type FilterType = 'checkList' | 'dateRange' | 'valueRange' | null;

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
};

export type OptionsData = {
  [key: string]: {
    buckets: Bucket[];
    excludeOwnFilter: { buckets: Bucket[] };
  };
};
