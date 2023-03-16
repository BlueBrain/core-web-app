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

export type Bucket = {
  doc_count: number;
  key: string;
  key_as_string: string;
};

export interface OptionsData {
  buckets: Bucket[];
  excludeOwnFilter: { buckets: Bucket[] };
}
