'use client';

import { atom } from 'jotai';
import { synapseConfigIdAtom } from './index';
import sessionAtom from '@/state/session';

import { fetchResourceById, fetchGeneratorTaskActivity } from '@/api/nexus';
import {
  SynapseConfigResource,
  DetailedCircuitResource,
  GeneratorTaskActivityResource,
} from '@/types/nexus';

export const refetchCounterAtom = atom<number>(0);

export const configAtom = atom<Promise<SynapseConfigResource | null>>(async (get) => {
  const session = get(sessionAtom);
  const id = await get(synapseConfigIdAtom);

  get(refetchCounterAtom);

  if (!session || !id) return null;

  return fetchResourceById<SynapseConfigResource>(id, session);
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
