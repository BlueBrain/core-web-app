import esb, { boolQuery, TermsQuery } from 'elastic-builder';
import buildESSort from './sorters';
import { DataQuery } from '@/api/explore-section/resources';
import { Filter } from '@/components/Filter/types';
import { SortState } from '@/types/explore-section/application';
import buildFilters from '@/queries/explore-section/filters';
import buildAggs from '@/queries/explore-section/aggs';
import { DataType } from '@/constants/explore-section/list-views';

export default function fetchDataQuery(
  size: number,
  currentPage: number,
  filters: Filter[],
  dataType: DataType,
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
    query: buildFilters(filters, searchString, descendantIds, dataType).toJSON(),
    ...buildAggs(filters).toJSON(),
  };
}

export const esQueryById = (resourceIds: string[]): object => {
  const filtersQuery = new esb.BoolQuery();
  filtersQuery.must(esb.termsQuery('@id.keyword', resourceIds));
  return { query: filtersQuery.toJSON() };
};

export function fetchDataQueryUsingIds(
  size: number,
  currentPage: number,
  filters: Filter[],
  inferredResponseIds: string[],
  sortState?: SortState
): DataQuery {
  const sortQuery = sortState && buildESSort(sortState);
  const idsQuery = new TermsQuery('_id', inferredResponseIds);

  const boolMustQuery = boolQuery().must([buildFilters(filters), idsQuery]);

  return {
    size,
    sort: sortQuery,
    from: (currentPage - 1) * size,
    track_total_hits: true,
    query: boolMustQuery.toJSON(),
    ...buildAggs(filters).toJSON(),
  };
}

export function fetchMorphoMetricsUsingIds(
  size: number,
  currentPage: number,
  filters: Filter[],
  inferredResponseIds: string[],
  sortState?: SortState
): DataQuery {
  const sortQuery = sortState && buildESSort(sortState);
  const idsQuery = new TermsQuery('neuronMorphology.@id.keyword', inferredResponseIds);

  const boolMustQuery = boolQuery().must([buildFilters(filters), idsQuery]);

  return {
    size,
    sort: sortQuery,
    from: (currentPage - 1) * size,
    track_total_hits: true,
    query: boolMustQuery.toJSON(),
  };
}
