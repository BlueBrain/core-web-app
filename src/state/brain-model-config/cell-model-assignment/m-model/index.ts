import { atom } from 'jotai';
import merge from 'lodash/merge';

import { ParamConfig, SynthesisPreviewInterface, MModelWorkflowOverrides } from '@/types/m-model';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { morphologyAssignmentConfigIdAtom } from '@/state/brain-model-config';
import sessionAtom from '@/state/session';
import {
  fetchResourceById,
  fetchGeneratorTaskActivity,
  fetchResourceSourceById,
  fetchFileMetadataByUrl,
} from '@/api/nexus';
import {
  MorphologyAssignmentConfigResource,
  DetailedCircuitResource,
  GeneratorTaskActivityResource,
  MorphologyAssignmentConfig,
  MorphologyAssignmentConfigPayload,
} from '@/types/nexus';
import { setRevision } from '@/util/nexus';
import { BRAIN_REGION_URI_BASE } from '@/util/brain-hierarchy';
import {
  initialMorphologyAssigmentConfigPayload,
  paramsAndDistResources,
} from '@/constants/cell-model-assignment/m-model';

export const selectedMModelNameAtom = atom<string | null>(null);

export const selectedMModelIdAtom = atom<string | null>(null);

export const mModelRemoteOverridesAtom = atom<ParamConfig | null>(null);

export const mModelOverridesAtom = atom<ParamConfig | {}>({});

export const mModelRemoteOverridesLoadedAtom = atom(false);

export const getMModelLocalOverridesAtom = atom<ParamConfig | null>((get) => {
  const remoteOverrides = get(mModelRemoteOverridesAtom);

  if (!remoteOverrides) return null;

  const localOverrides = get(mModelOverridesAtom);

  const localConfig = {} as ParamConfig;
  merge(localConfig, remoteOverrides, localOverrides);
  return localConfig;
});

export const mModelPreviewConfigAtom = atom<SynthesisPreviewInterface>({
  ...paramsAndDistResources,
  overrides: {},
});

export const refetchTriggerAtom = atom<{}>({});

export const configAtom = atom<Promise<MorphologyAssignmentConfigResource | null>>(async (get) => {
  const session = get(sessionAtom);
  const id = await get(morphologyAssignmentConfigIdAtom);

  get(refetchTriggerAtom);

  if (!session || !id) return null;

  return fetchResourceById<MorphologyAssignmentConfigResource>(id, session);
});

export const configSourceAtom = atom<Promise<MorphologyAssignmentConfig | null>>(async (get) => {
  const session = get(sessionAtom);
  const id = await get(morphologyAssignmentConfigIdAtom);

  get(refetchTriggerAtom);

  if (!session || !id) return null;

  return fetchResourceSourceById<MorphologyAssignmentConfig>(id, session);
});

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

export const configPayloadUrlAtom = atom<Promise<string | null>>(async (get) => {
  const config = await get(configAtom);
  if (!config) return null;

  return config.distribution.contentUrl;
});

export const configPayloadRevAtom = atom<Promise<number | null>>(async (get) => {
  const session = get(sessionAtom);
  const configPayloadUrl = await get(configPayloadUrlAtom);

  get(refetchTriggerAtom);

  if (!session || !configPayloadUrl) {
    return null;
  }

  const url = setRevision(configPayloadUrl, null);

  if (!url) {
    return null;
  }

  const metadata = await fetchFileMetadataByUrl(url, session);

  return metadata._rev;
});

export const initialMorphologyAssigmentConfigPayloadAtom = atom<MorphologyAssignmentConfigPayload>(
  initialMorphologyAssigmentConfigPayload
);

export const getMModelLocalTopologicalSynthesisParamsAtom = atom<MModelWorkflowOverrides>((get) => {
  const selectedBrainRegion = get(selectedBrainRegionAtom);
  const selectedMTypeId = get(selectedMModelIdAtom);

  if (!selectedBrainRegion || !selectedMTypeId)
    throw new Error('Brain Region and m-type must be selected');

  const overrides = get(mModelOverridesAtom);
  const fullBrainRegionId = `${BRAIN_REGION_URI_BASE}/${selectedBrainRegion.id}`;

  return {
    [fullBrainRegionId]: {
      [selectedMTypeId]: {
        // TODO: use proper CanonicalMorphologyModel from nexus
        id: 'https://bbp.epfl.ch/neurosciencegraph/data/b5a28383-82d2-47c8-a803-8b3707cdb44a',
        overrides,
      },
    },
  };
});
