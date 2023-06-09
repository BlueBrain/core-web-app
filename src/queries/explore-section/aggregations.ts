import set from 'lodash/fp/set';

import { CheckListFilter, Filter } from '@/components/Filter/types';
import { ES_TERMS } from '@/constants/explore-section';

type FilterTerm = {
  [key: string]: string;
};

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
      filter: FilterTerm[];
    };
  };
};

type ESAggsAndFilter = ESAggs & ESFilter;

/* Returns a ChecklistFilter-specific ES filter term object */
function getChecklistTerm({ field, value }: Omit<CheckListFilter, 'title' | 'type'>) {
  return value.length
    ? {
        [field]: value,
      }
    : undefined;
}

function getESTerm(field: string) {
  return ES_TERMS[field]?.term as string; // TODO: Check this coersion
}

function getFilterTerm(esTerm: string, type: string, value: Filter['value']) {
  let filterTerm;

  // TODO: Add more cases for other filter types.
  switch (type) {
    case 'checkList':
      filterTerm = getChecklistTerm({ field: esTerm, value: value as CheckListFilter['value'] });
      break;
    default:
      filterTerm = undefined;
  }

  return filterTerm as FilterTerm | undefined;
}

function getFilter(post_filter: ESFilter['post_filter'], filterTerm?: FilterTerm) {
  return {
    ...(filterTerm // TODO: Handle different filter types
      ? {
          post_filter: set(
            'bool.filter',
            [...(post_filter?.bool?.filter ?? []), { terms: filterTerm }],
            post_filter ?? {}
          ),
        }
      : { post_filter }),
  };
}

function getAggs(
  aggs: ESAggs['aggs'],
  field: string,
  esTerm: string,
  otherFieldsTerms: FilterTerm
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
                        },
                      },
                    },
                  }
                : {
                    terms: {
                      field: esTerm,
                      size: 100,
                    },
                  }),
              ...(Object.keys(otherFieldsTerms).length && {
                filter: {
                  bool: {
                    filter: Object.entries(otherFieldsTerms).map(([key, term]) => ({
                      terms: {
                        [key]: term,
                      },
                    })),
                  },
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
  const filterTerm = getFilterTerm(esTerm as string, type, value); // TODO: Check this coersion

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
