import { atom } from 'jotai/vanilla';

import { BrainModelConfigResource } from '@/types/nexus';
import sessionAtom from '@/state/session';
import { recentlyUsedConfigIdsAtom } from '@/state/brain-model-config';
import {
  fetchBrainModelConfigsByIds,
  fetchPublicBrainModels,
  fetchPersonalBrainModels,
} from '@/api/nexus';

const refetchAllTriggerAtom = atom<{}>({});
export const triggerRefetchAllAtom = atom(null, (get, set) => set(refetchAllTriggerAtom, {}));

const refetchRecentTriggerAtom = atom<{}>({});
export const triggerRefetchRecentAtom = atom(null, (get, set) => set(refetchRecentTriggerAtom, {}));

const refetchPublicTriggerAtom = atom<{}>({});
export const triggerRefetchPublicAtom = atom(null, (get, set) => set(refetchPublicTriggerAtom, {}));

const refetchPersonalTriggerAtom = atom<{}>({});
export const triggerRefetchPersonalAtom = atom(null, (get, set) =>
  set(refetchPersonalTriggerAtom, {})
);

export const recentConfigsAtom = atom<Promise<BrainModelConfigResource[]>>(async (get) => {
  const session = get(sessionAtom);
  const ids = get(recentlyUsedConfigIdsAtom);

  get(refetchAllTriggerAtom);
  get(refetchRecentTriggerAtom);

  if (!session || !ids.length) return [];

  return fetchBrainModelConfigsByIds(ids, session);
});

export const publicConfigsAtom = atom<Promise<BrainModelConfigResource[]>>(async (get) => {
  const session = get(sessionAtom);

  get(refetchAllTriggerAtom);
  get(refetchPublicTriggerAtom);

  if (!session) return [];

  return fetchPublicBrainModels(session);
});

export const personalConfigsAtom = atom<Promise<BrainModelConfigResource[]>>(async (get) => {
  const session = get(sessionAtom);

  get(refetchAllTriggerAtom);
  get(refetchPublicTriggerAtom);

  if (!session) return [];

  return fetchPersonalBrainModels(session);
});
