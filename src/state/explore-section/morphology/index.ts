'use client';

import { atom } from 'jotai';
import {
  Aggregations,
  MorphologyResponse,
  TotalHits,
  MorphologyResource,
} from '@/types/explore-section';
import { Filter } from '@/components/Filter/types';
import getDataQuery from '@/queries/explore-section/data';
import { getMorphologyData } from '@/api/explore-section';
import sessionAtom from '@/state/session';

const TYPE = 'https://neuroshapes.org/NeuronMorphology';

export const pageSizeAtom = atom<number>(10);

export const pageNumberAtom = atom<number>(1);

export const searchStringAtom = atom<string>('');

export const filtersAtom = atom<Filter[]>([
  { field: 'createdBy', type: 'checkList', value: [] },
  { field: 'eType', type: 'checkList', value: [] },
]);

export const queryAtom = atom<object>((get) => {
  const searchString = get(searchStringAtom);
  const pageNumber = get(pageNumberAtom);
  const pageSize = get(pageSizeAtom);
  const filters = get(filtersAtom);
  return getDataQuery(pageSize, pageNumber, filters, TYPE, searchString);
});

const queryResponseAtom = atom<Promise<MorphologyResponse> | null>((get) => {
  const session = get(sessionAtom);
  const query = get(queryAtom);

  if (!session) return null;

  return getMorphologyData(session.accessToken, query);
});

export const dataAtom = atom<Promise<MorphologyResource[] | undefined>>(async (get) => {
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
