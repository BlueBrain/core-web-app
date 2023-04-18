import { atom } from 'jotai';
import {
  Aggregations,
  TotalHits,
  ExploreSectionResponse,
  ExploreSectionResource,
} from '@/types/explore-section';
import { Filter } from '@/components/Filter/types';
import getDataQuery from '@/queries/explore-section/data';
import sessionAtom from '@/state/session';
import getData from '@/api/explore-section';

interface DataQueryParams {
  type: string;
  defaultFilters?: Filter[];
}

const createListViewAtoms = ({ type, defaultFilters = [] }: DataQueryParams) => {
  const pageSizeAtom = atom<number>(10);

  const pageNumberAtom = atom<number>(1);

  const sortFieldAtom = atom<string>('createdAt');

  const sortDirectionAtom = atom<'asc' | 'desc'>('desc');

  const searchStringAtom = atom<string>('');

  const filtersAtom = atom<Filter[]>([
    { field: 'createdBy', type: 'checkList', value: [] },
    { field: 'eType', type: 'checkList', value: [] },
    ...defaultFilters,
  ]);

  const queryAtom = atom<object>((get) => {
    const searchString = get(searchStringAtom);
    const pageNumber = get(pageNumberAtom);
    const pageSize = get(pageSizeAtom);
    const filters = get(filtersAtom);
    const sortField = get(sortFieldAtom);
    const sortDirection = get(sortDirectionAtom);

    return getDataQuery(
      pageSize,
      pageNumber,
      filters,
      type,
      searchString,
      sortField,
      sortDirection
    );
  });

  const queryResponseAtom = atom<Promise<ExploreSectionResponse> | null>((get) => {
    const session = get(sessionAtom);
    const query = get(queryAtom);

    if (!session) return null;

    return getData(session.accessToken, query);
  });

  const dataAtom = atom<Promise<ExploreSectionResource[] | undefined>>(async (get) => {
    const { hits } = (await get(queryResponseAtom)) ?? {};

    return hits;
  });

  const totalAtom = atom<Promise<TotalHits | undefined>>(async (get) => {
    const { total } = (await get(queryResponseAtom)) ?? { total: { relation: 'eq', value: 0 } };

    return total;
  });

  const aggregationsAtom = atom<Promise<Aggregations | undefined>>(async (get) => {
    const response = await get(queryResponseAtom);

    return response?.aggs;
  });

  return {
    pageSizeAtom,
    searchStringAtom,
    filtersAtom,
    dataAtom,
    totalAtom,
    aggregationsAtom,
  };
};

export default createListViewAtoms;
