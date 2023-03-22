import { createSearchStringQueryFilter } from './es';
import { CheckListFilter, Filter } from '@/components/Filter/types';

export default function getEphysDataQuery(
  size: number,
  currentPage: number,
  filters: Filter[],
  searchString: string = ''
) {
  const contributor = filters.find(({ field }) => field === 'contributor');
  const contributorFilter = (contributor as CheckListFilter).value.length && {
    terms: {
      'contributors.identifier.keyword': contributor?.value, // "contributors" not "contributor"
    },
  };

  const eType = filters.find(({ field }) => field === 'eType');
  const eTypeFilter = (eType as CheckListFilter).value.length && {
    terms: {
      'eType.label.keyword': eType?.value,
    },
  };

  // Used for aggregations
  const contributorTerms = {
    terms: {
      field: 'contributors.identifier.keyword',
      size: 100,
    },
  };
  // Prepare filter, if one exists.
  const contributorAggs = {
    filter: eTypeFilter,
    aggs: {
      excludeOwnFilter: {
        ...contributorTerms,
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
    filter: contributorFilter,
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
      contributor: {
        ...((eType as CheckListFilter).value.length ? contributorAggs : contributorTerms),
      },
      eType: {
        ...((contributor as CheckListFilter).value.length ? eTypeAggs : eTypeTerms),
      },
    },
    ...([contributorFilter, eTypeFilter].filter((n) => n).length && {
      post_filter: {
        bool: {
          filter: [contributorFilter, eTypeFilter].filter((n) => n), // Filter out "empty" vals
        },
      },
    }),
  };
}
