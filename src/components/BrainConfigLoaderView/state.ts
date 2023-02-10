import { atom } from 'jotai/vanilla';

import sessionAtom from '@/state/session';
import { recentlyUsedConfigIdsAtom } from '@/state/brain-model-config';
import { BrainModelConfigResource } from '@/types/nexus';
import { fetchBrainModelConfigsByIds, queryES } from '@/api/nexus';
import {
  getPublicBrainModelConfigsQuery,
  getPersonalBrainModelConfigsQuery,
  getArchiveBrainModelConfigsQuery,
} from '@/queries/es';

export const refetchTriggerAtom = atom<{}>({});
export const triggerRefetchAtom = atom(null, (get, set) => set(refetchTriggerAtom, {}));

type SearchType = 'public' | 'personal' | 'archive';

export const searchTypeAtom = atom<SearchType>('public');

export const searchStringAtom = atom<string>('');

export const recentlyUsedConfigsAtom = atom<Promise<BrainModelConfigResource[]>>(async (get) => {
  const session = get(sessionAtom);
  const ids = get(recentlyUsedConfigIdsAtom);

  get(refetchTriggerAtom);

  if (!session || !ids.length) return [];

  return fetchBrainModelConfigsByIds(ids, session);
});

export const brainModelConfigListAtom = atom<Promise<BrainModelConfigResource[]>>(async (get) => {
  const session = get(sessionAtom);
  const searchType = get(searchTypeAtom);
  const searchString = get(searchStringAtom);

  get(refetchTriggerAtom);

  if (!session) return [];

  let query;

  if (searchType === 'public') {
    query = getPublicBrainModelConfigsQuery(searchString);
  } else if (searchType === 'personal') {
    query = getPersonalBrainModelConfigsQuery(session.user.username, searchString);
  } else {
    query = getArchiveBrainModelConfigsQuery(searchString);
  }

  return queryES<BrainModelConfigResource>(query, session);
});
