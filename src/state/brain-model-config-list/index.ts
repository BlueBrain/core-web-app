import { atom } from 'jotai';

import {
  getPublicBrainModelConfigsQuery,
  getPersonalBrainModelConfigsQuery,
  getArchiveBrainModelConfigsQuery,
  getBuiltBrainModelConfigsQuery,
  getGeneratorTaskActivitiesQuery,
} from '@/queries/es';
import { queryES } from '@/api/nexus';
import sessionAtom from '@/state/session';
import { BrainModelConfigResource, GeneratorTaskActivityResource } from '@/types/nexus';

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

export const builtConfigListAtom = atom<Promise<BrainModelConfigResource[]>>(async (get) => {
  const session = get(sessionAtom);
  const searchString = get(searchConfigListStringAtom);

  get(refetchTriggerAtom);

  if (!session) return [];
  const generatorQuery = getGeneratorTaskActivitiesQuery();
  const generatorTaskActivities = await queryES<GeneratorTaskActivityResource>(
    generatorQuery,
    session
  );
  const synapseConfigsUsedByGenerators = generatorTaskActivities
    .filter((gta) => gta.used['@id'].includes('/synapseconfigs/'))
    .map((gta) => gta.used['@id']);

  const brainModelConfigQuery = getBuiltBrainModelConfigsQuery(
    searchString,
    synapseConfigsUsedByGenerators
  );
  return queryES<BrainModelConfigResource>(brainModelConfigQuery, session);
});
