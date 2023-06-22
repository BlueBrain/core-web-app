import { atom } from 'jotai';
import { ExploreSectionResponse, ExploreSectionResource } from '@/types/explore-section/resources';
import { TotalHits, Aggregations } from '@/types/explore-section/fields';
import { SortState } from '@/types/explore-section/application';
import { Filter } from '@/components/Filter/types';
import fetchDataQuery from '@/queries/explore-section/data';
import sessionAtom from '@/state/session';
import fetchEsResourcesByType from '@/api/explore-section/resources';
import LISTING_CONFIG from '@/constants/explore-section/es-terms-render';

interface DataQueryParams {
  type: string;
  columns: string[];
}

const columnKeyToFilter = (key: string): Filter => {
  const fieldConfig = LISTING_CONFIG[key];
  switch (fieldConfig.filter) {
    case 'checkList':
      return {
        field: key,
        type: 'checkList',
        value: [],
        aggregationType: 'buckets',
        title: LISTING_CONFIG[key].title,
      };
    case 'dateRange':
      return {
        field: key,
        type: 'dateRange',
        value: { gte: null, lte: null },
        aggregationType: 'stats',
        title: LISTING_CONFIG[key].title,
      };
    case 'valueRange':
      return {
        field: key,
        type: 'valueRange',
        value: { gte: null, lte: null },
        aggregationType: 'stats',
        title: LISTING_CONFIG[key].title,
        unit: LISTING_CONFIG[key].unit,
      };
    default:
      return {
        field: key,
        title: LISTING_CONFIG[key].title,
        aggregationType: null,
        type: null,
        value: null,
      };
  }
};

const createListViewAtoms = ({ type, columns }: DataQueryParams) => {
  const pageSizeAtom = atom<number>(30);

  const pageNumberAtom = atom<number>(1);

  const searchStringAtom = atom<string>('');

  const sortStateAtom = atom<SortState>({ field: 'createdAt', order: 'asc' });

  const filtersAtom = atom<Filter[]>(columns.map((colKey) => columnKeyToFilter(colKey)));

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
