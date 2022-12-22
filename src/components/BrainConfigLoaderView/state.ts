import { atom } from 'jotai';

import sessionAtom from '@/state/session';
import { recentlyUsedConfigIdsAtom } from '@/state/brain-model-config';
import { BrainModelConfig } from '@/types/nexus';
import { composeUrl } from '@/util/nexus';
import { fetchBrainModelConfigsByIds } from '@/api/nexus';
import { nexus } from '@/config';
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

export const recentlyUsedConfigsAtom = atom<Promise<BrainModelConfig[]>>(async (get) => {
  const session = get(sessionAtom);
  const ids = get(recentlyUsedConfigIdsAtom);

  get(refetchTriggerAtom);

  if (!session || !ids.length) return [];

  return fetchBrainModelConfigsByIds(ids, session);
});

export const brainModelConfigListAtom = atom<Promise<BrainModelConfig[]>>(async (get) => {
  const session = get(sessionAtom);
  const searchType = get(searchTypeAtom);
  const searchString = get(searchStringAtom);

  get(refetchTriggerAtom);

  if (!session) return [];

  const apiUrl = composeUrl('view', nexus.defaultESIndexId, { viewType: 'es' });

  let query;

  if (searchType === 'public') {
    query = getPublicBrainModelConfigsQuery();
  } else if (searchType === 'personal') {
    query = getPersonalBrainModelConfigsQuery(searchString, session.user.username);
  } else {
    query = getArchiveBrainModelConfigsQuery();
  }

  return fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(query),
  })
    .then((res) => res.json())
    .then((res) => res.hits.hits)
    .then((hits) => hits.map((hit: any) => hit._source as BrainModelConfig));
});
