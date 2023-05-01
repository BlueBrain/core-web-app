import { atom } from 'jotai';

import {
  getPublicBrainModelConfigsQuery,
  getPersonalBrainModelConfigsQuery,
  getArchiveBrainModelConfigsQuery,
} from '@/queries/es';
import { queryES } from '@/api/nexus';
import sessionAtom from '@/state/session';
import { BrainModelConfigResource } from '@/types/nexus';

type SearchType = 'public' | 'personal' | 'archive';

export const searchConfigListTypeAtom = atom<SearchType>('public');

export const searchConfigListStringAtom = atom<string>('');

export const refetchTriggerAtom = atom<{}>({});

export const configListAtom = atom<Promise<BrainModelConfigResource[]>>(async (get) => {
  const session = get(sessionAtom);
  const searchType = get(searchConfigListTypeAtom);
  const searchString = get(searchConfigListStringAtom);

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
