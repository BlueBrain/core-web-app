'use client';

import { atom } from 'jotai';
import { eModelAssignmentConfigIdAtom } from './index';
import sessionAtom from '@/state/session';

import { fetchResourceById, fetchGeneratorTaskActivity } from '@/api/nexus';
import {
  EModelAssignmentConfigResource,
  DetailedCircuitResource,
  GeneratorTaskActivityResource,
  EModelAssignmentConfig,
} from '@/types/nexus';

const refetchTriggerAtom = atom<{}>({});
export const triggerRefetchAtom = atom(null, (get, set) => set(refetchTriggerAtom, {}));

export const configAtom = atom<Promise<EModelAssignmentConfigResource | null>>(async (get) => {
  const session = get(sessionAtom);
  const id = await get(eModelAssignmentConfigIdAtom);

  get(refetchTriggerAtom);

  if (!session || !id) return null;

  return fetchResourceById<EModelAssignmentConfigResource>(id, session);
});

export const configSourceAtom = atom<Promise<EModelAssignmentConfig | null>>(async (get) => {
  const session = get(sessionAtom);
  const id = await get(eModelAssignmentConfigIdAtom);

  get(refetchTriggerAtom);

  if (!session || !id) return null;

  return fetchResourceById<EModelAssignmentConfig>(id, session);
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
