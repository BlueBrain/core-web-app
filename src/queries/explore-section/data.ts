import buildESSort from './sorters';
import { Filter } from '@/components/Filter/types';
import { SortState } from '@/types/explore-section/application';
import buildFilters from '@/queries/explore-section/filters';
import buildAggs from '@/queries/explore-section/aggs';

export default function fetchDataQuery(
  size: number,
  currentPage: number,
  filters: Filter[],
  type: string,
  sortState?: SortState,
  searchString: string = ''
) {
  const sortQuery = sortState && buildESSort(sortState);

  const filtersQ = buildFilters(type, filters, searchString).toJSON();
  const aggsQ = buildAggs(filters).toJSON();
  console.log(filtersQ);
  return {
    size,
    sort: sortQuery,
    from: (currentPage - 1) * size,
    track_total_hits: true,
    query: filtersQ,
    ...aggsQ,
  };
}
