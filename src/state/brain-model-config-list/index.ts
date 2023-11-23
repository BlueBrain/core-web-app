import { atom } from 'jotai';

import {
  getPublicBrainModelConfigsQuery,
  getPersonalBrainModelConfigsQuery,
  getArchiveBrainModelConfigsQuery,
  getBuiltBrainModelConfigsQuery,
  getGeneratorTaskActivitiesQuery,
  getSynapseConfigsQuery,
} from '@/queries/es';
import { queryES } from '@/api/nexus';
import sessionAtom from '@/state/session';
import {
  BrainModelConfigResource,
  GeneratorTaskActivityResource,
  SynapseConfigResource,
  SynapseConfigType,
} from '@/types/nexus';

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

  // TODO Refactor to make sure that the logic here works in case the number of synapse configs is larger than ES query's `DEFAULT_SIZE`.

  const synapseConfigs = await queryES<SynapseConfigResource>(getSynapseConfigsQuery(), session);
  const synapseIdAndVersionMap = new Map<string, number>();
  synapseConfigs.forEach((synapseConfig) => {
    synapseIdAndVersionMap.set(synapseConfig['@id'], synapseConfig._rev);
  });

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
    .filter((gta) => synapseIdAndVersionMap.get(gta.used_config['@id']) === gta.used_rev)
    .map((gta) => gta.used_config['@id']);

  const brainModelConfigQuery = getBuiltBrainModelConfigsQuery(
    searchString,
    synapseConfigsUsedByGenerators
  );

  return queryES<BrainModelConfigResource>(brainModelConfigQuery, session);
});
