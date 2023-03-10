'use client';

import { atom } from 'jotai';

import sessionAtom from '../session';
import getEphysData from '@/api/observatory';
import { EphysResource } from '@/types/observatory';
import { getEphysDataQuery } from '@/queries/es';

export const pageSizeAtom = atom(10);

export const pageNumberAtom = atom(1);

export const searchStringAtom = atom('');

export const queryAtom = atom<object>((get) => {
  const searchString = get(searchStringAtom);
  const pageNumber = get(pageNumberAtom);
  const pageSize = get(pageSizeAtom);
  const query = getEphysDataQuery(searchString, pageSize, pageNumber);
  return query;
});

export const dataAtom = atom<Promise<EphysResource[]> | null>((get) => {
  const session = get(sessionAtom);
  const query = get(queryAtom);
  if (!session) return null;
  return getEphysData(session.accessToken, query);
});
