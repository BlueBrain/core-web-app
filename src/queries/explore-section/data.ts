import buildElasticsearchSort from './sorters';
import { createSearchStringQueryFilter } from '@/queries/es';
import { Filter } from '@/components/Filter/types';
import buildAggregations from '@/queries/explore-section/aggregations';

export default function fetchDataQuery(
  size: number,
  currentPage: number,
  filters: Filter[],
  type: string,
  sortState: any,
  searchString: string = ''
) {
  const { aggregations, createdByFilter, eTypeFilter } = buildAggregations(filters);
  const sortQuery = buildElasticsearchSort(sortState);

  return {
    size,
    sort: sortQuery,
    from: (currentPage - 1) * size,
    track_total_hits: true,
    query: {
      bool: {
        filter: [
          {
            term: {
              '@type.keyword': type,
            },
          },
          searchString ? createSearchStringQueryFilter(searchString, ['*']) : null,
        ].filter(Boolean),
        must: [
          {
            match: {
              deprecated: false,
            },
          },
        ],
      },
    },
    aggs: aggregations,
    ...([createdByFilter, eTypeFilter].filter((n) => n).length && {
      post_filter: {
        bool: {
          filter: [createdByFilter, eTypeFilter].filter((n) => n), // Filter out "empty" vals
        },
      },
    }),
  };
}
