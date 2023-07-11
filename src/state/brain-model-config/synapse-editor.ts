'use client';

import { atom } from 'jotai';
import { synapseConfigIdAtom } from './index';
import sessionAtom from '@/state/session';

import {
  fetchResourceById,
  fetchGeneratorTaskActivity,
  fetchResourceSourceById,
  fetchFileMetadataByUrl,
  fetchJsonFileByUrl,
} from '@/api/nexus';
import {
  SynapseConfigResource,
  DetailedCircuitResource,
  GeneratorTaskActivityResource,
  SynapseConfig,
  SynapseConfigPayload,
} from '@/types/nexus';
import { setRevision } from '@/util/nexus';
import { SynapticAssignmentRule } from '@/types/connectome-model-assignment';

export const refetchCounterAtom = atom<number>(0);

export const configAtom = atom<Promise<SynapseConfigResource | null>>(async (get) => {
  const session = get(sessionAtom);
  const id = await get(synapseConfigIdAtom);

  get(refetchCounterAtom);

  if (!session || !id) return null;

  return fetchResourceById<SynapseConfigResource>(id, session);
});

export const configSourceAtom = atom<Promise<SynapseConfig | null>>(async (get) => {
  const session = get(sessionAtom);
  const id = await get(synapseConfigIdAtom);

  get(refetchCounterAtom);

  if (!session || !id) return null;

  return fetchResourceSourceById<SynapseConfig>(id, session);
});

export const configPayloadUrlAtom = atom<Promise<string | null>>(async (get) => {
  const config = await get(configAtom);
  if (!config) return null;

  return config.distribution.contentUrl;
});

export const configPayloadRevAtom = atom<Promise<number | null>>(async (get) => {
  const session = get(sessionAtom);
  const configPayloadUrl = await get(configPayloadUrlAtom);

  get(refetchCounterAtom);

  if (!session || !configPayloadUrl) return null;

  const configPayloadBaseUrl = setRevision(configPayloadUrl, null);

  const metadata = await fetchFileMetadataByUrl(configPayloadBaseUrl, session);

  return metadata._rev;
});

export const remoteConfigPayloadAtom = atom(async (get) => {
  const session = get(sessionAtom);
  const configPayloadUrl = await get(configPayloadUrlAtom);

  if (!session || !configPayloadUrl) {
    return null;
  }

  return fetchJsonFileByUrl<SynapseConfigPayload>(configPayloadUrl, session);
});

export const localConfigPayloadAtom = atom<WeakMap<SynapseConfigPayload, SynapseConfigPayload>>(
  new WeakMap()
);

export const synapseConfigPayloadAtom = atom(async (get) => {
  const remoteConfigPayload = await get(remoteConfigPayloadAtom);

  if (!remoteConfigPayload) return null;

  const localConfigPayload = get(localConfigPayloadAtom).get(remoteConfigPayload);

  return localConfigPayload ?? remoteConfigPayload;
});

export const synapticAssignmentRulesEntityAtom = atom<Promise<SynapseConfigResource | null>>(
  async (get) => {
    const session = get(sessionAtom);
    const remoteConfigPayload = await get(remoteConfigPayloadAtom);

    if (!session || !remoteConfigPayload) return null;

    const { id, rev } = remoteConfigPayload.synaptic_assignment;

    return fetchResourceSourceById(id, session, { rev });
  }
);

export const synapticAssignmentRules = atom<Promise<SynapticAssignmentRule[] | null>>(
  async (get) => {
    const session = get(sessionAtom);
    const synapticAssignmentEntity = await get(synapticAssignmentRulesEntityAtom);

    if (!session || !synapticAssignmentEntity) return null;
    return fetchJsonFileByUrl(synapticAssignmentEntity.distribution.contentUrl, session);
  }
);

export const synapticParametersEntityAtom = atom<Promise<SynapseConfigResource | null>>(
  async (get) => {
    const session = get(sessionAtom);
    const remoteConfigPayload = await get(remoteConfigPayloadAtom);

    if (!session || !remoteConfigPayload) return null;

    const { id, rev } = remoteConfigPayload.synaptic_parameters;

    return fetchResourceSourceById(id, session, { rev });
  }
);

export const synapticAssignmentParameters = atom<Promise<SynapticAssignmentRule[] | null>>(
  async (get) => {
    const session = get(sessionAtom);
    const synapticParametersEntity = await get(synapticParametersEntityAtom);

    if (!session || !synapticParametersEntity) return null;
    return fetchJsonFileByUrl(synapticParametersEntity.distribution.contentUrl, session);
  }
);

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
