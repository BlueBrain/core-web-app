'use client';

import { atom } from 'jotai';
import { microconnectomeIdAtom } from './index';
import sessionAtom from '@/state/session';

import { fetchResourceById, fetchGeneratorTaskActivity } from '@/api/nexus';
import { MicroConnectomeConfigResource, GeneratorTaskActivityResource } from '@/types/nexus';

const refetchTriggerAtom = atom<{}>({});
export const triggerRefetchAtom = atom(null, (_, set) => set(refetchTriggerAtom, {}));

const configAtom = atom<Promise<MicroConnectomeConfigResource | null>>(async (get) => {
  const session = get(sessionAtom);
  const id = await get(microconnectomeIdAtom);

  get(refetchTriggerAtom);

  if (!session || !id) return null;

  return fetchResourceById<MicroConnectomeConfigResource>(id, session);
});

const generatorTaskActivityAtom = atom<Promise<GeneratorTaskActivityResource | null>>(
  async (get) => {
    const session = get(sessionAtom);
    const config = await get(configAtom);

    if (!session || !config) return null;

    return fetchGeneratorTaskActivity(config['@id'], config._rev, session);
  }
);

export const microconnectomeConfigAtom = atom<Promise<MicroConnectomeConfigResource | null>>(
  async (get) => {
    const session = get(sessionAtom);
    const generatorTaskActivity = await get(generatorTaskActivityAtom);

    if (!session || !generatorTaskActivity) return null;

    return fetchResourceById<MicroConnectomeConfigResource>(
      generatorTaskActivity.generated['@id'],
      session
    );
  }
);
