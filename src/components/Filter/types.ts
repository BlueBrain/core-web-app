interface BaseFilter {
  field: string;
}

interface DateRangeFilter extends BaseFilter {
  type: 'dateRange';
  value: {
    gte: string | null;
    lte: string | null;
  };
}

export interface CheckListFilter extends BaseFilter {
  type: 'checkList';
  value: string[];
}

export type Filter = DateRangeFilter | CheckListFilter;

export interface CheckboxOption {
  checked: string | boolean;
  count: number | null;
  key: string;
}

type Bucket = {
  key: string;
  doc_count: number;
};

export interface OptionsData {
  [key: string]: {
    buckets: Bucket[];
    excludeOwnFilter: { buckets: Bucket[] };
  };
}
