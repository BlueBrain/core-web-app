import { atom } from 'jotai';
import isEqual from 'lodash/isEqual';

import { ExploreSectionResponse, ESResponseRaw } from '@/types/explore-section/resources';
import { TotalHits, Aggregations } from '@/types/explore-section/fields';
import { SortState } from '@/types/explore-section/application';
import { Filter } from '@/components/Filter/types';
import fetchDataQuery from '@/queries/explore-section/data';
import sessionAtom from '@/state/session';
import fetchEsResourcesByType from '@/api/explore-section/resources';
import LISTING_CONFIG from '@/constants/explore-section/es-terms-render';
import { typeToColumns } from '@/state/explore-section/type-to-columns';

const columnKeyToFilter = (key: string): Filter => {
  const fieldConfig = LISTING_CONFIG[key];
  switch (fieldConfig.filter) {
    case 'checkList':
      return {
        field: key,
        type: 'checkList',
        value: [],
        aggregationType: 'buckets',
      };
    case 'dateRange':
      return {
        field: key,
        type: 'dateRange',
        value: { gte: null, lte: null },
        aggregationType: 'stats',
      };
    case 'valueRange':
      return {
        field: key,
        type: 'valueRange',
        value: { gte: null, lte: null },
        aggregationType: 'stats',
      };
    default:
      return {
        field: key,
        aggregationType: null,
        type: null,
        value: null,
      };
  }
};

export const pageSizeAtom = atom<number>(30);

export const pageNumberAtom = atom<number>(1);

export const searchStringAtom = atom<string>('');

export const sortStateAtom = atom<SortState | undefined>({ field: 'createdAt', order: 'desc' });

export const typeAtom = atom<string | undefined>(undefined);

export const columnKeysAtom = atom<string[]>((get) => {
  const type = get(typeAtom);
  if (!type) return [];
  return typeToColumns[type as string];
});

export const activeColumnsAtom = atom<string[]>([]);

export const initializeActiveColumnsAtom = atom(null, (get, set) => {
  const columnKeys = get(columnKeysAtom);
  if (columnKeys.length === 0) return;

  const activeColumns = ['index', ...columnKeys];

  if (isEqual(activeColumns, get(activeColumnsAtom))) return;

  set(activeColumnsAtom, activeColumns);
});

export const filtersAtom = atom<Filter[]>([]);

export const initializeFiltersAtom = atom(null, (get, set) => {
  const columnsKeys = get(columnKeysAtom);
  if (!columnsKeys) {
    set(filtersAtom, []);
  }

  const filters = columnsKeys.map((colKey) => columnKeyToFilter(colKey));
  if (isEqual(filters, get(filtersAtom))) return;

  set(filtersAtom, filters);
});

export const queryAtom = atom<object>((get) => {
  const type = get(typeAtom);
  const searchString = get(searchStringAtom);
  const pageNumber = get(pageNumberAtom);
  const pageSize = get(pageSizeAtom);
  const sortState = get(sortStateAtom);
  const filters = get(filtersAtom);
  if (!type || !filters) {
    return null;
  }

  return fetchDataQuery(pageSize, pageNumber, filters, type, sortState, searchString);
});

const refetchCounterAtom = atom<number>(0);

export const triggerRefetchAtom = atom(null, async (get, set) => {
  set(refetchCounterAtom, (counter) => counter + 1);
});

const queryResponseAtom = atom<Promise<ExploreSectionResponse> | null>((get) => {
  const session = get(sessionAtom);
  const query = get(queryAtom);

  get(refetchCounterAtom);

  if (!session) return null;

  return fetchEsResourcesByType(session.accessToken, query);
});

export const dataAtom = atom<Promise<ESResponseRaw[] | undefined>>(async (get) => {
  const { hits } = (await get(queryResponseAtom)) ?? {};
  return hits;
});

export const totalAtom = atom<Promise<TotalHits | undefined>>(async (get) => {
  const { total } = (await get(queryResponseAtom)) ?? { total: { relation: 'eq', value: 0 } };

  return total;
});

export const aggregationsAtom = atom<Promise<Aggregations | undefined>>(async (get) => {
  const response = await get(queryResponseAtom);

  return response?.aggs;
});
