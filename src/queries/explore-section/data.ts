import { boolQuery, TermsQuery } from 'elastic-builder';
import buildESSort from './sorters';
import { DataQuery } from '@/api/explore-section/resources';
import { Filter } from '@/components/Filter/types';
import { SortState } from '@/types/explore-section/application';
import buildFilters from '@/queries/explore-section/filters';
import buildAggs from '@/queries/explore-section/aggs';

export default function fetchDataQuery(
  size: number,
  currentPage: number,
  filters: Filter[],
  experimentDataType: string,
  sortState?: SortState,
  searchString: string = '',
  descendantIds?: string[]
): DataQuery {
  const sortQuery = sortState && buildESSort(sortState);
  return {
    size,
    sort: sortQuery,
    from: (currentPage - 1) * size,
    track_total_hits: true,
    query: buildFilters(experimentDataType, filters, searchString, descendantIds).toJSON(),
    ...buildAggs(filters).toJSON(),
  };
}

export function fetchDataQueryUsingIds(
  size: number,
  currentPage: number,
  filters: Filter[],
  experimentDataType: string,
  inferredResponseIds: string[],
  sortState?: SortState,
  searchString: string = '',
  descendantIds?: string[]
): DataQuery {
  const sortQuery = sortState && buildESSort(sortState);

  const idsQuery = new TermsQuery('_id', inferredResponseIds);

  const boolMustQuery = boolQuery().must([
    buildFilters(experimentDataType, filters, searchString, descendantIds),
    idsQuery,
  ]);

  return {
    size,
    sort: sortQuery,
    from: (currentPage - 1) * size,
    track_total_hits: true,
    query: boolMustQuery.toJSON(),
    ...buildAggs(filters).toJSON(),
  };
}
