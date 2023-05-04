'use client';

import { atom } from 'jotai';
import pick from 'lodash/pick';
import { DeltaResource, FetchParams } from '@/types/explore-section';
import { fetchResourceById } from '@/api/nexus';
import sessionAtom from '@/state/session';

const createDetailAtoms = () => {
  const infoAtom = atom<FetchParams>({});

  const detailAtom = atom<Promise<DeltaResource | null>>(async (get) => {
    const session = get(sessionAtom);
    const info = get(infoAtom);

    if (!session || !info.id || !info.org || !info.project) return null;

    return fetchResourceById(info.id, session, pick(info, ['org', 'project', 'rev']));
  });

  const latestRevisionAtom = atom<Promise<number | null>>(async (get) => {
    const session = get(sessionAtom);
    const info = get(infoAtom);

    if (!session || !info.id || !info.org || !info.project) return null;

    const latestRevision: DeltaResource = await fetchResourceById(
      info.id,
      session,
      pick(info, ['org', 'project'])
    );
    return latestRevision._rev;
  });

  return {
    infoAtom,
    detailAtom,
    latestRevisionAtom,
  };
};

export default createDetailAtoms;
