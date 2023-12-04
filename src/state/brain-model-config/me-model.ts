/*
  Note: this file was created separate instead of putting it into
  state/brain-model-config/cell-model-assignment/me-model
  to avoid cycle dependency
*/
import { atom } from 'jotai';

import { meModelConfigIdAtom } from './index';
import {
  DetailedCircuitResource,
  GeneratorTaskActivityResource,
  MEModelConfigResource,
} from '@/types/nexus';
import sessionAtom from '@/state/session';
import { fetchGeneratorTaskActivity, fetchResourceById } from '@/api/nexus';

export const configAtom = atom<Promise<MEModelConfigResource | null>>(async (get) => {
  const session = get(sessionAtom);
  const id = await get(meModelConfigIdAtom);

  if (!session || !id) return null;

  return fetchResourceById<MEModelConfigResource>(id, session);
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
