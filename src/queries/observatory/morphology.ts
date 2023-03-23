import { createSearchStringQueryFilter } from '../es';
import { Filter } from '@/components/Filter/types';
import buildAggregations from '@/queries/observatory/aggregations';

export default function getMorphologyDataQuery(
  size: number,
  currentPage: number,
  filters: Filter[],
  searchString: string = ''
) {
  const { aggregations, createdByFilter, eTypeFilter } = buildAggregations(filters);

  return {
    size,
    sort: [{ createdAt: { order: 'desc' } }],
    from: (currentPage - 1) * size,
    query: {
      bool: {
        filter: [
          {
            term: {
              '@type.keyword': 'https://neuroshapes.org/NeuronMorphology',
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
