'use client';

import { atom } from 'jotai/vanilla';
import { selectAtom, atomWithStorage } from 'jotai/vanilla/utils';

import sessionAtom from '@/state/session';
import { BrainModelConfigResource } from '@/types/nexus';
import { fetchResourceById, updateResource } from '@/api/nexus';

const RECENTLY_USED_SIZE = 5;

export const idAtom = atom<string | null>(null);

export const recentlyUsedConfigIdsAtom = atomWithStorage<string[]>('recentlyUsedConfigs', []);

export const addRecentlyUsedConfigIdAtom = atom(null, (get, set, id: string) => {
  const recentlyusedConfigIds = get(recentlyUsedConfigIdsAtom);

  const updatedList = [
    id,
    ...recentlyusedConfigIds.filter((configId) => configId !== id).slice(0, RECENTLY_USED_SIZE),
  ];

  set(recentlyUsedConfigIdsAtom, updatedList);
});

export const refetchTriggerAtom = atom<{}>({});
export const triggerRefetchAtom = atom(null, (get, set) => set(refetchTriggerAtom, {}));

export const configAtom = atom<Promise<BrainModelConfigResource | null>>(async (get) => {
  const session = get(sessionAtom);
  const id = get(idAtom);

  get(refetchTriggerAtom);

  if (!session || !id) return null;

  return fetchResourceById<BrainModelConfigResource>(id, session);
});

export const updateConfigAtom = atom(null, async (get, set, config: BrainModelConfigResource) => {
  const session = get(sessionAtom);

  if (!session) {
    throw new Error('No session state found');
  }

  updateResource(config, config._rev, session);

  set(triggerRefetchAtom);
});

export const getNameAtom = selectAtom(configAtom, (config) => config?.name);

export const updateNameAtom = atom(null, async (get, set, name: string) => {
  const config = await get(configAtom);

  if (!config) return;

  const updatedConfig = { ...config, name };

  set(updateConfigAtom, updatedConfig);
});

export const getDescriptionAtom = selectAtom(configAtom, (config) => config?.description);

export const updateDescriptionAtom = atom(null, async (get, set, description: string) => {
  const config = await get(configAtom);

  if (!config) return;

  const updatedConfig = { ...config, description };

  set(updateConfigAtom, updatedConfig);
});

export const getCellCompositionConfigIdAtom = selectAtom(
  configAtom,
  (config) => config?.configs?.cellCompositionConfig?.['@id'] ?? null
);

export const getCellPositionConfigIdAtom = selectAtom(
  configAtom,
  (config) => config?.configs?.cellPositionConfig?.['@id'] ?? null
);
