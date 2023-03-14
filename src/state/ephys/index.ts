'use client';

import { atom } from 'jotai';

import sessionAtom from '../session';
import getEphysData from '@/api/observatory';
import { Aggregations, EphysResource, EphysResponse } from '@/types/observatory';
import { Filter } from '@/components/Filter/types';
import getEphysDataQuery from '@/queries/ephys';

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
  const query = getEphysDataQuery(pageSize, pageNumber, filters, searchString);

  return query;
});

const queryResponseAtom = atom<Promise<EphysResponse> | null>((get) => {
  const session = get(sessionAtom);
  const query = get(queryAtom);

  if (!session) return null;

  return getEphysData(session.accessToken, query);
});

export const dataAtom = atom<Promise<EphysResource[] | undefined>>(async (get) => {
  const { hits } = (await get(queryResponseAtom)) ?? {};

  return hits;
});

export const aggregationsAtom = atom<Promise<Aggregations | undefined>>(async (get) => {
  const response = await get(queryResponseAtom);

  return response?.aggs;
});
