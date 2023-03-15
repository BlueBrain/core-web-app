import { createSearchStringQueryFilter } from './es';
import { CheckListFilter, Filter } from '@/components/Filter/types';

export default function getEphysDataQuery(
  size: number,
  currentPage: number,
  filters: Filter[],
  searchString: string = ''
) {
  const createdBy = filters.find(({ field }) => field === 'createdBy');
  const createdByFilter = (createdBy as CheckListFilter).value.length && {
    terms: {
      'createdBy.keyword': createdBy?.value,
    },
  };

  const eType = filters.find(({ field }) => field === 'eType');
  const eTypeFilter = (eType as CheckListFilter).value.length && {
    terms: {
      'eType.label.keyword': eType?.value,
    },
  };

  // Used for aggregations
  const createdByTerms = {
    multi_terms: {
      terms: [
        {
          field: 'contributors.identifier.keyword',
        },
        {
          field: 'contributors.label.keyword',
        },
      ],
      size: 100,
    },
  };
  // Prepare filter, if one exists.
  const createdByAggs = {
    filter: eTypeFilter,
    aggs: {
      excludeOwnFilter: {
        ...createdByTerms,
      },
    },
  };

  // Used for aggregations
  const eTypeTerms = {
    terms: {
      field: 'eType.label.keyword',
      size: 100,
    },
  };
  // Prepare filter, if one exists.
  const eTypeAggs = {
    filter: createdByFilter,
    aggs: {
      excludeOwnFilter: {
        ...eTypeTerms,
      },
    },
  };

  return {
    size,
    sort: [{ createdAt: { order: 'desc' } }],
    from: (currentPage - 1) * size,
    query: {
      bool: {
        filter: [
          {
            term: {
              '@type.keyword': 'https://neuroshapes.org/Trace',
            },
          },
          searchString
            ? createSearchStringQueryFilter(searchString, ['name', 'description'])
            : null,
        ].filter(Boolean),
        must: [
          {
            match: {
              deprecated: false,
            },
          },
        ],
        must_not: [],
      },
    },
    aggs: {
      createdBy: {
        ...((eType as CheckListFilter).value.length ? createdByAggs : createdByTerms),
      },
      eType: {
        ...((createdBy as CheckListFilter).value.length ? eTypeAggs : eTypeTerms),
      },
    },
    ...([createdByFilter, eTypeFilter].filter((n) => n).length && {
      post_filter: {
        bool: {
          filter: [createdByFilter, eTypeFilter].filter((n) => n), // Filter out "empty" vals
        },
      },
    }),
  };
}
