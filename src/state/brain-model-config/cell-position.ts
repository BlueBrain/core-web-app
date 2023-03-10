'use client';

import { atom } from 'jotai';
import { cellPositionConfigIdAtom } from './index';
import sessionAtom from '@/state/session';

import { fetchResourceById, fetchGeneratorTaskActivity } from '@/api/nexus';
import {
  CellPositionConfigResource,
  DetailedCircuitResource,
  GeneratorTaskActivityResource,
} from '@/types/nexus';

const refetchTriggerAtom = atom<{}>({});
export const triggerRefetchAtom = atom(null, (get, set) => set(refetchTriggerAtom, {}));

const configAtom = atom<Promise<CellPositionConfigResource | null>>(async (get) => {
  const session = get(sessionAtom);
  const id = await get(cellPositionConfigIdAtom);

  get(refetchTriggerAtom);

  if (!session || !id) return null;

  return fetchResourceById<CellPositionConfigResource>(id, session);
});

const generatorTaskActivityAtom = atom<Promise<GeneratorTaskActivityResource | null>>(
  async (get) => {
    const session = get(sessionAtom);
    const config = await get(configAtom);

    if (!session || !config) return null;

    return fetchGeneratorTaskActivity(config['@id'], config._rev, session);
  }
);

export const partialCircuitAtom = atom<Promise<DetailedCircuitResource | null>>(async (get) => {
  const session = get(sessionAtom);
  const generatorTaskActivity = await get(generatorTaskActivityAtom);

  if (!session || !generatorTaskActivity) return null;

  return fetchResourceById<DetailedCircuitResource>(
    generatorTaskActivity.generated['@id'],
    session
  );
});
