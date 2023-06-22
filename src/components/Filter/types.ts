interface BaseFilter {
  field: string;
  title: string;
}

export interface CheckListFilter extends BaseFilter {
  type: 'checkList';
  value: string[];
}

export interface RangeFilter extends BaseFilter {
  type: 'dateRange' | 'valueRange';
  value: {
    gte: Date | null;
    lte: Date | null;
  };
}

export interface ValueFilter extends BaseFilter {
  type: 'value';
  value: number | string | null;
}

export type Filter = CheckListFilter | RangeFilter | ValueFilter;

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
