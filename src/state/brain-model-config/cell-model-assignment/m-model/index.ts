import { atom } from 'jotai';
import merge from 'lodash/merge';

import { ParamConfig, SynthesisPreviewInterface, MModelWorkflowOverrides } from '@/types/m-model';
import { morphologyAssignmentConfigIdAtom } from '@/state/brain-model-config';
import sessionAtom from '@/state/session';
import {
  fetchResourceById,
  fetchGeneratorTaskActivity,
  fetchResourceSourceById,
  fetchFileMetadataByUrl,
  fetchJsonFileByUrl,
} from '@/api/nexus';
import {
  MorphologyAssignmentConfigResource,
  DetailedCircuitResource,
  GeneratorTaskActivityResource,
  MorphologyAssignmentConfig,
  MorphologyAssignmentConfigPayload,
  CanonicalMorphologyModelConfigPayload,
  CanonicalMorphologyModelConfig,
} from '@/types/nexus';
import { setRevision } from '@/util/nexus';
import {
  initialMorphologyAssigmentConfigPayload,
  paramsAndDistResources,
} from '@/constants/cell-model-assignment/m-model';
import { generateBrainMTypeMapKey } from '@/util/cell-model-assignment';

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

export const mModelPreviewConfigAtom = atom<SynthesisPreviewInterface>((get) => {
  const localOverrides = get(mModelOverridesAtom);
  return {
    ...paramsAndDistResources,
    overrides: localOverrides,
  };
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

export const remoteConfigPayloadAtom = atom<Promise<MorphologyAssignmentConfigPayload | null>>(
  async (get) => {
    const session = get(sessionAtom);
    const configPayloadUrl = await get(configPayloadUrlAtom);

    if (!session || !configPayloadUrl) {
      return null;
    }

    const url = configPayloadUrl;

    if (!url) {
      return null;
    }

    return fetchJsonFileByUrl<MorphologyAssignmentConfigPayload>(url, session);
  }
);

export const initialMorphologyAssigmentConfigPayloadAtom = atom<MorphologyAssignmentConfigPayload>(
  initialMorphologyAssigmentConfigPayload
);

export const accumulativeLocalTopologicalSynthesisParamsAtom = atom<MModelWorkflowOverrides>({});

export const selectedCanonicalMapAtom = atom<Map<string, boolean>>((get) => {
  const accumulativeTopologicalSynthesis = get(accumulativeLocalTopologicalSynthesisParamsAtom);
  const brainRegionIds = Object.keys(accumulativeTopologicalSynthesis);
  const selectedCanonicalMap = new Map();
  brainRegionIds.forEach((brainRegionId) => {
    const mTypeIds = Object.keys(accumulativeTopologicalSynthesis[brainRegionId]);
    mTypeIds.forEach((mTypeId) => {
      selectedCanonicalMap.set(generateBrainMTypeMapKey(brainRegionId, mTypeId), true);
    });
  });
  return selectedCanonicalMap;
});

// serves as 'cache' so we don't have to re-fetch params
export const fetchedRemoteOverridesMapAtom = atom<Map<string, ParamConfig>>(new Map());

export const canonicalMorphologyModelConfigIdAtom = atom<Promise<string | null>>(async (get) => {
  const remoteConfigPayload = await get(remoteConfigPayloadAtom);

  if (!remoteConfigPayload) return null;

  const { id } = remoteConfigPayload.defaults.topological_synthesis;
  return id;
});

export const remoteCanonicalMorphologyModelConfigPayloadAtom = atom<
  Promise<CanonicalMorphologyModelConfig | null>
>(async (get) => {
  const session = get(sessionAtom);
  const canonicalMorphologyModelConfigId = await get(canonicalMorphologyModelConfigIdAtom);

  if (!session || !canonicalMorphologyModelConfigId) return null;

  return fetchResourceById<CanonicalMorphologyModelConfig>(
    canonicalMorphologyModelConfigId,
    session
  );
});

export const canonicalMorphologyModelConfigPayloadAtom =
  atom<CanonicalMorphologyModelConfigPayload | null>(null);

export const canonicalBrainRegionIdsAtom = atom<string[]>((get) => {
  const canonicalMorphologyModelConfig = get(canonicalMorphologyModelConfigPayloadAtom);

  if (!canonicalMorphologyModelConfig) return [];

  return Object.keys(canonicalMorphologyModelConfig.hasPart);
});

export const canonicalMapAtom = atom<Map<string, boolean>>((get) => {
  const canonicalBrainRegionIds = get(canonicalBrainRegionIdsAtom);
  const canonicalMorphologyModelConfig = get(canonicalMorphologyModelConfigPayloadAtom);

  const canonicalMap = new Map();
  if (!canonicalBrainRegionIds.length || !canonicalMorphologyModelConfig) return canonicalMap;

  canonicalBrainRegionIds.forEach((brainRegionId) => {
    const mTypeIds = Object.keys(canonicalMorphologyModelConfig.hasPart[brainRegionId].hasPart);
    mTypeIds.forEach((mTypeId) => {
      canonicalMap.set(generateBrainMTypeMapKey(brainRegionId, mTypeId), true);
    });
  });
  return canonicalMap;
});
