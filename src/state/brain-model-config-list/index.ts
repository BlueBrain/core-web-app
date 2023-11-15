import { atom } from 'jotai';

import { recentlyUsedConfigIdsAtom } from '../brain-model-config';
import {
  getPublicBrainModelConfigsQuery,
  getPersonalBrainModelConfigsQuery,
  getArchiveBrainModelConfigsQuery,
  getBuiltBrainModelConfigsQuery,
  getGeneratorTaskActivitiesQuery,
} from '@/queries/es';
import { fetchBrainModelConfigsByIds, queryES } from '@/api/nexus';
import sessionAtom from '@/state/session';
import {
  BrainModelConfigResource,
  GeneratorTaskActivityResource,
  SynapseConfigType,
} from '@/types/nexus';

export type SearchType = 'public' | 'personal' | 'archive' | 'recent';

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
  } else if (searchType === 'recent') {
    const ids = get(recentlyUsedConfigIdsAtom);
    if (!ids.length) return [];
    return fetchBrainModelConfigsByIds(ids, session);
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

  const synapseConfigTypeName: SynapseConfigType = 'SynapseConfig';

  const synapseConfigsUsedByGenerators = generatorTaskActivities
    .filter((gta) => {
      if (!gta.used_config) return false;
      return gta.used_config['@type'].includes(synapseConfigTypeName);
    })
    .map((gta) => gta.used_config['@id']);

  const brainModelConfigQuery = getBuiltBrainModelConfigsQuery(
    searchString,
    synapseConfigsUsedByGenerators
  );
  return queryES<BrainModelConfigResource>(brainModelConfigQuery, session);
});
