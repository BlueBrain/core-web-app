import { atom } from 'jotai';
import {
  Aggregations,
  TotalHits,
  ExploreSectionResponse,
  ExploreSectionResource,
  SortState,
} from '@/types/explore-section';
import { Filter } from '@/components/Filter/types';
import fetchDataQuery from '@/queries/explore-section/data';
import { TYPE_FILTER_MAPPING, DEFAULT_FILTERS } from '@/constants/explore-section';
import sessionAtom from '@/state/session';
import fetchEsResourcesByType from '@/api/explore-section';

interface DataQueryParams {
  type: string;
}

const createListViewAtoms = ({ type }: DataQueryParams) => {
  const pageSizeAtom = atom<number>(30);

  const pageNumberAtom = atom<number>(1);

  const searchStringAtom = atom<string>('');

  const sortStateAtom = atom<SortState>({ field: 'createdAt', order: 'asc' });

  const filtersAtom = atom<Filter[]>([
    ...DEFAULT_FILTERS,
    ...TYPE_FILTER_MAPPING[type],
  ] as Filter[]);

  const queryAtom = atom<object>((get) => {
    const searchString = get(searchStringAtom);
    const pageNumber = get(pageNumberAtom);
    const pageSize = get(pageSizeAtom);
    const sortState = get(sortStateAtom);
    const filters = get(filtersAtom);
    return fetchDataQuery(pageSize, pageNumber, filters, type, sortState, searchString);
  });

  const queryResponseAtom = atom<Promise<ExploreSectionResponse> | null>((get) => {
    const session = get(sessionAtom);
    const query = get(queryAtom);

    if (!session) return null;

    return fetchEsResourcesByType(session.accessToken, query);
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
    sortStateAtom,
  };
};

export default createListViewAtoms;
