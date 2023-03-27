'use client';

import { atom } from 'jotai';
import { Aggregations, MorphologyResponse, ObservatoryResource } from '@/types/observatory';
import { Filter } from '@/components/Filter/types';
import getMorphologyDataQuery from '@/queries/observatory/morphology';
import { getMorphologyData } from '@/api/observatory';
import sessionAtom from '@/state/session';

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
  return getMorphologyDataQuery(pageSize, pageNumber, filters, searchString);
});

const queryResponseAtom = atom<Promise<MorphologyResponse> | null>((get) => {
  const session = get(sessionAtom);
  const query = get(queryAtom);

  if (!session) return null;

  return getMorphologyData(session.accessToken, query);
});

export const dataAtom = atom<Promise<ObservatoryResource[] | undefined>>(async (get) => {
  const { hits } = (await get(queryResponseAtom)) ?? {};

  return hits;
});

export const aggregationsAtom = atom<Promise<Aggregations | undefined>>(async (get) => {
  const response = await get(queryResponseAtom);

  return response?.aggs;
});
