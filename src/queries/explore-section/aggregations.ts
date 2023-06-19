import set from 'lodash/fp/set';
import { format } from 'date-fns';
import { CheckListFilter, Filter, RangeFilter } from '@/components/Filter/types';
import { ES_TERMS } from '@/constants/explore-section';

type RangeValue = {
  gte: string;
  lte: string;
};

type FilterTerm = {
  [key: string]: string | RangeValue;
};

type TermWithType = Partial<Record<'terms' | 'range', FilterTerm>>;

type ESAggs = {
  aggs: {
    [field: string]: {
      aggs: {
        // Will be either this (if this filter is applied)...
        excludeOwnFilter?: {
          terms: {
            field: string;
            size: number;
          };
        };
      };
      // or this (default).
      terms?: {
        field: string;
        size: number;
      };
      // Only apply filter for other enabled filters.
      filter?: {
        bool: {
          filter: FilterTerm[];
        };
      };
    };
  };
};

type ESFilter = {
  // Only applied if filters are enabled.
  post_filter?: {
    bool: {
      must: FilterTerm[];
    };
  };
};

type ESAggsAndFilter = ESAggs & ESFilter;

/* Returns a ChecklistFilter-specific ES filter term object */
function getChecklistTerm({ field, value }: Omit<CheckListFilter, 'title' | 'type'>) {
  return value.length
    ? {
        terms: {
          [field]: value,
        },
      }
    : undefined;
}

function getRangeTerm({ field, value }: { field: string; value: RangeValue }) {
  const { gte, lte } = value;

  return gte || lte
    ? ({
        range: {
          [field]: {
            ...(gte ? { gte } : undefined),
            ...(lte ? { lte } : undefined),
          },
        },
      } as TermWithType)
    : undefined;
}

function getESTerm(field: string) {
  return ES_TERMS[field]?.term as string;
}

function getFilterTerm(esTerm: string, type: Filter['type'], value: Filter['value']) {
  let filterTerm;

  switch (type) {
    case 'checkList':
      filterTerm = getChecklistTerm({ field: esTerm, value: value as CheckListFilter['value'] });
      break;
    case 'dateRange':
      filterTerm =
        Object.values(value).every((el) => el !== undefined) &&
        getRangeTerm({
          field: esTerm,
          value: Object.fromEntries(
            Object.entries(value as RangeFilter['value']).map(([termName, dateValue]) => [
              termName,
              dateValue ? format(dateValue, 'yyyy-MM-dd') : null, // Convert date to string for ES query.
            ])
          ) as RangeValue,
        });
      break;
    default:
      filterTerm = undefined;
  }

  return filterTerm as FilterTerm | undefined;
}

function getFilter(post_filter: ESFilter['post_filter'], filterTerm?: FilterTerm) {
  return {
    ...(filterTerm
      ? {
          post_filter: set(
            'bool.must',
            [...(post_filter?.bool?.must ?? []), filterTerm],
            post_filter ?? {}
          ),
        }
      : { post_filter }),
  };
}

/* Compiles an array of filter terms from the filter state of all filters (except the current one). */
function applyOtherFieldsTerms(
  termsWithType: TermWithType[],
  [termType, terms]: [string, FilterTerm]
) {
  return Object.entries(terms).reduce(
    (innerTermsWithType: TermWithType[], [termLabel, termValue]: [string, any]) => [
      ...innerTermsWithType,
      {
        [termType]: {
          [termLabel]: termValue,
        },
      } as TermWithType,
    ],
    termsWithType
  );
}

function getAggs(
  aggs: ESAggs['aggs'],
  field: string,
  esTerm: string,
  otherFieldsTerms: TermWithType
) {
  return {
    aggs: {
      ...aggs,
      ...(esTerm !== undefined
        ? {
            [field]: {
              ...(Object.keys(otherFieldsTerms).length
                ? {
                    aggs: {
                      excludeOwnFilter: {
                        terms: {
                          field: esTerm,
                          size: 100,
                          // ...(value.length && { include: value, min_doc_count: 0 }), // Preserve any selected fields.
                        },
                      },
                    },
                    filter: {
                      bool: {
                        must: Object.entries(otherFieldsTerms).reduce(applyOtherFieldsTerms, []),
                      },
                    },
                  }
                : {
                    terms: {
                      field: esTerm,
                      size: 100,
                    },
                  }),
            },
          }
        : undefined),
    },
  };
}

function reduceAggsAndTerms(
  { aggs, post_filter }: ESAggsAndFilter,
  { field, type, value }: Filter,
  _i: number,
  arr: Filter[]
) {
  const esTerm = getESTerm(field);
  const filterTerm = getFilterTerm(esTerm, type, value);

  // Get all other filter terms.
  const otherFieldsTerms = arr
    .filter(({ field: arrField }) => arrField !== field) // Filter-out self,
    .reduce(
      (arrAcc, { field: arrField, type: arrType, value: arrValue }) => ({
        ...arrAcc,
        ...getFilterTerm(getESTerm(arrField), arrType, arrValue),
      }), // then add-in all other filters.
      {}
    );

  return {
    ...(getAggs(aggs, field, esTerm, otherFieldsTerms) as ESAggs),
    ...(getFilter(post_filter, filterTerm) as ESFilter),
  };
}

export default function buildAggsAndFilter(filters: Filter[]) {
  return filters.reduce(reduceAggsAndTerms, { aggs: {} } as ESAggsAndFilter);
}
