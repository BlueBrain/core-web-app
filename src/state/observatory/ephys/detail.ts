'use client';

import { atom } from 'jotai';
import pick from 'lodash/pick';
import sessionAtom from '../../session';
import { EphysDeltaResource, FetchParams } from '@/types/observatory';
import { fetchResourceById } from '@/api/nexus';

export const infoAtom = atom<FetchParams>({});

export const detailAtom = atom<Promise<EphysDeltaResource | null>>(async (get) => {
  const session = get(sessionAtom);
  const info = get(infoAtom);

  if (!session || !info.id || !info.org || !info.project) return null;

  return fetchResourceById(info.id, session, pick(info, ['org', 'project']));
});
