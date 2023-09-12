import { atom } from 'jotai';
import merge from 'lodash/merge';
import lodashGet from 'lodash/get';

import {
  ParamConfig,
  SynthesisPreviewInterface,
  MModelWorkflowOverrides,
  NeuriteType,
} from '@/types/m-model';
import { morphologyAssignmentConfigIdAtom } from '@/state/brain-model-config';
import sessionAtom from '@/state/session';
import {
  fetchResourceById,
  fetchGeneratorTaskActivity,
  fetchFileMetadataByUrl,
  fetchJsonFileByUrl,
  fetchResourceByUrl,
} from '@/api/nexus';
import {
  MorphologyAssignmentConfigResource,
  DetailedCircuitResource,
  GeneratorTaskActivityResource,
  MorphologyAssignmentConfig,
  MorphologyAssignmentConfigPayload,
  CanonicalMorphologyModelConfigPayload,
  CanonicalMorphologyModelConfig,
  CanonicalMorphologyModel,
  NeuronMorphologyModelParameter,
} from '@/types/nexus';
import { setRevision } from '@/util/nexus';
import { paramsAndDistResources } from '@/constants/cell-model-assignment/m-model';
import {
  generateBrainRegionMTypeMapKey,
  generateBrainRegionMTypeArray,
} from '@/util/cell-model-assignment';
import { selectedBrainRegionAtom } from '@/state/brain-regions';

export const selectedMModelNameAtom = atom<string | null>(null);

export const selectedMModelIdAtom = atom<string | null>(null);

export const mModelRemoteParamsAtom = atom<ParamConfig | null>(null);

export const mModelLocalParamsAtom = atom<ParamConfig | {}>({});

export const mModelRemoteParamsLoadedAtom = atom(false);

export const mModelNeuriteTypeSelectedAtom = atom<NeuriteType>('apical_dendrite');

export const getMModelLocalParamsAtom = atom<ParamConfig | null>((get) => {
  const remoteParams = get(mModelRemoteParamsAtom);

  if (!remoteParams) return null;

  const localParams = get(mModelLocalParamsAtom);

  const localConfig = {} as ParamConfig;
  merge(localConfig, remoteParams, localParams);
  return localConfig;
});

export const mModelPreviewConfigAtom = atom<SynthesisPreviewInterface>((get) => {
  const localOverrides = get(mModelLocalParamsAtom);
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

  return fetchResourceById<MorphologyAssignmentConfig>(id, session);
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

export const brainRegionMTypeArrayAtom = atom<string[] | null>((get) => {
  const selectedBrainRegion = get(selectedBrainRegionAtom);
  const selectedMTypeId = get(selectedMModelIdAtom);

  if (!selectedBrainRegion || !selectedMTypeId) return null;

  if (selectedBrainRegion.leaves || !selectedBrainRegion.representedInAnnotation) return null;

  return generateBrainRegionMTypeArray(selectedBrainRegion.id, selectedMTypeId);
});

export const localMModelWorkflowOverridesAtom = atom<MModelWorkflowOverrides>({});

export const mModelWorkflowOverridesAtom = atom<Promise<MModelWorkflowOverrides>>(async (get) => {
  const local = get(localMModelWorkflowOverridesAtom);
  const remoteConfigPayload = await get(remoteConfigPayloadAtom);
  const remote = remoteConfigPayload?.configuration.topological_synthesis;
  return { ...remote, ...local };
});

export const selectedCanonicalMapAtom = atom<Promise<Map<string, boolean>>>(async (get) => {
  const mModelWorkflowOverrides = await get(mModelWorkflowOverridesAtom);
  const brainRegionIds = Object.keys(mModelWorkflowOverrides);
  const selectedCanonicalMap = new Map();
  brainRegionIds.forEach((brainRegionId) => {
    const mTypeIds = Object.keys(mModelWorkflowOverrides[brainRegionId]);
    mTypeIds.forEach((mTypeId) => {
      selectedCanonicalMap.set(generateBrainRegionMTypeMapKey(brainRegionId, mTypeId), true);
    });
  });
  return selectedCanonicalMap;
});

// serves as 'cache' so we don't have to re-fetch params
export const cachedDefaultParamsMapAtom = atom<Map<string, ParamConfig>>(new Map());

export const canonicalMorphologyModelConfigIdAtom = atom<Promise<string | null>>(async (get) => {
  const remoteConfigPayload = await get(remoteConfigPayloadAtom);

  if (!remoteConfigPayload) return null;

  const { id } = remoteConfigPayload.defaults.topological_synthesis;
  return id;
});

export const remoteParamsAtom = atom<Promise<ParamConfig | {}>>(async (get) => {
  const remoteConfigPayload = await get(remoteConfigPayloadAtom);
  const brainRegionMTypeArray = get(brainRegionMTypeArrayAtom);

  if (!remoteConfigPayload || !brainRegionMTypeArray) return {};

  const workflowOverrides = remoteConfigPayload.configuration.topological_synthesis;
  const path = [...brainRegionMTypeArray, 'overrides'];
  const brainMTypeParams = lodashGet(workflowOverrides, path);
  return brainMTypeParams || {};
});

export const remoteCanonicalMorphologyModelConfigAtom = atom<
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

export const canonicalBrainRegionIdsAtom = atom<Promise<string[]>>(async (get) => {
  const canonicalMorphologyModelConfig = await get(canonicalMorphologyModelConfigPayloadAtom);

  if (!canonicalMorphologyModelConfig) return [];

  return Object.keys(canonicalMorphologyModelConfig.hasPart);
});

export const canonicalBrainRegionMTypeMapAtom = atom<Promise<Map<string, boolean>>>(async (get) => {
  const canonicalBrainRegionIds = await get(canonicalBrainRegionIdsAtom);
  const canonicalMorphologyModelConfig = await get(canonicalMorphologyModelConfigPayloadAtom);

  const canonicalMap = new Map();
  if (!canonicalBrainRegionIds.length || !canonicalMorphologyModelConfig) return canonicalMap;

  canonicalBrainRegionIds.forEach((brainRegionId) => {
    const mTypeIds = Object.keys(canonicalMorphologyModelConfig.hasPart[brainRegionId].hasPart);
    mTypeIds.forEach((mTypeId) => {
      canonicalMap.set(generateBrainRegionMTypeMapKey(brainRegionId, mTypeId), true);
    });
  });
  return canonicalMap;
});

export const canonicalMorphologyModelIdAtom = atom<Promise<string | null>>(async (get) => {
  const brainRegionMTypeArray = get(brainRegionMTypeArrayAtom);

  if (!brainRegionMTypeArray) return null;

  const [brainRegionId, mTypeId] = brainRegionMTypeArray;

  const canonicalMorphologyModelConfigPayload = await get(
    canonicalMorphologyModelConfigPayloadAtom
  );
  if (!canonicalMorphologyModelConfigPayload) throw new Error('No canonical payload');

  const canonicalMorphologyModelId = Object.keys(
    canonicalMorphologyModelConfigPayload.hasPart[brainRegionId].hasPart[mTypeId].hasPart
  )[0];

  return canonicalMorphologyModelId;
});

export const canonicalModelParametersAtom = atom<Promise<ParamConfig | null>>(async (get) => {
  const session = get(sessionAtom);
  const canonicalMorphologyModelId = await get(canonicalMorphologyModelIdAtom);

  if (!session || !canonicalMorphologyModelId) return null;

  const canonicalMorphologyModel = await fetchResourceById<CanonicalMorphologyModel>(
    canonicalMorphologyModelId,
    session
  );

  const neuronMorphologyModelParameter = await fetchResourceById<NeuronMorphologyModelParameter>(
    canonicalMorphologyModel.morphologyModelParameter['@id'],
    session
  );

  const distributionUrl = neuronMorphologyModelParameter.distribution.contentUrl;

  return fetchJsonFileByUrl<ParamConfig>(distributionUrl, session);
});

export const canonicalMorphologyModelConfigPayloadAtom = atom<
  Promise<CanonicalMorphologyModelConfigPayload | null>
>(async (get) => {
  const session = get(sessionAtom);
  const remoteCanonicalMorphologyModelConfigPayload = await get(
    remoteCanonicalMorphologyModelConfigAtom
  );

  if (!session || !remoteCanonicalMorphologyModelConfigPayload) return null;

  const payloadUrl = remoteCanonicalMorphologyModelConfigPayload.distribution.contentUrl;
  const payload = await fetchResourceByUrl<CanonicalMorphologyModelConfigPayload>(
    payloadUrl,
    session
  );

  // process data to have revision also in the url (hack until the m-type is fixed in composition)
  // https://bbpteam.epfl.ch/project/issues/browse/BBPP134-616
  const processedPayload: CanonicalMorphologyModelConfigPayload = structuredClone(payload);
  const brainRegionIds = Object.keys(processedPayload.hasPart);
  brainRegionIds.forEach((brainRegionId) => {
    const mTypeParentDict = processedPayload.hasPart[brainRegionId].hasPart;
    const mTypeIds = Object.keys(mTypeParentDict);
    mTypeIds.forEach((mTypeId) => {
      const data = mTypeParentDict[mTypeId];
      mTypeParentDict[`${mTypeId}?rev=${data._rev}`] = data;
      delete mTypeParentDict[mTypeId];
    });
  });

  return processedPayload;
});
