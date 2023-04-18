import { createSearchStringQueryFilter } from '@/queries/es';
import { Filter } from '@/components/Filter/types';
import buildAggregations from '@/queries/explore-section/aggregations';
import { ElasticsearchSortQueryBuilder } from './es-sort-builder';

export default function getDataQuery (
  size: number,
  currentPage: number,
  filters: Filter[],
  type: string,
  searchString: string = '',
  sortField: string,
  sortDirection: 'asc' | 'desc'
) {
  const { aggregations, createdByFilter, eTypeFilter } = buildAggregations(filters);

  const sortQueryBuilder = new ElasticsearchSortQueryBuilder({
    field: sortField,
    order: sortDirection,
  });
  const sortQuery = sortQueryBuilder.build();

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
