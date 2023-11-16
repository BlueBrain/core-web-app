'use client';

import { atom } from 'jotai';
import { selectAtom, atomWithStorage } from 'jotai/utils';

import sessionAtom from '@/state/session';
import { BrainModelConfig, BrainModelConfigResource } from '@/types/nexus';
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

export const configSourceAtom = atom<Promise<BrainModelConfig | null>>(async (get) => {
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

  updateResource(config, session);

  set(triggerRefetchAtom);
});

export const getNameAtom = selectAtom(configAtom, (config) => config?.name);

export const getCreatedByAtom = selectAtom(configAtom, (config) => config?._createdBy);

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

export const isConfigEditableAtom = atom<Promise<boolean>>(async (get) => {
  const session = get(sessionAtom);
  const createdBy = await get(getCreatedByAtom);

  if (!session || !createdBy) return false;

  return createdBy.split('/').reverse()[0] === session.user.username;
});

/*
  The usage of selectAtom might be beneficial here,
  but it seems there is an issue with a combination of:
    * selectAtom derived from an async atom.
    * loadable used further down the dependency chain.
  TODO: submit an issue to Jotai, refactor to use selectAtom when fixed.
*/
export const cellCompositionConfigIdAtom = atom<Promise<string | null>>(async (get) => {
  const config = await get(configAtom);

  return config?.configs?.cellCompositionConfig?.['@id'] ?? null;
});

export const cellPositionConfigIdAtom = atom<Promise<string | null>>(async (get) => {
  const config = await get(configAtom);

  return config?.configs.cellPositionConfig?.['@id'] ?? null;
});

export const eModelAssignmentConfigIdAtom = atom<Promise<string | null>>(async (get) => {
  const config = await get(configAtom);

  return config?.configs.eModelAssignmentConfig?.['@id'] ?? null;
});

export const morphologyAssignmentConfigIdAtom = atom<Promise<string | null>>(async (get) => {
  const config = await get(configAtom);

  return config?.configs.morphologyAssignmentConfig?.['@id'] ?? null;
});

export const meModelConfigIdAtom = atom<Promise<string | null>>(async (get) => {
  const config = await get(configAtom);

  return config?.configs.meModelConfig?.['@id'] ?? null;
});

export const microConnectomeConfigIdAtom = selectAtom(
  configAtom,
  (config) => config?.configs.microConnectomeConfig?.['@id']
);

export const synapseConfigIdAtom = atom<Promise<string | null>>(async (get) => {
  const config = await get(configAtom);

  return config?.configs?.synapseConfig?.['@id'] ?? null;
});

export const macroConnectomeConfigIdAtom = atom<Promise<string | null>>(async (get) => {
  const config = await get(configAtom);

  return config?.configs.macroConnectomeConfig?.['@id'] ?? null;
});
