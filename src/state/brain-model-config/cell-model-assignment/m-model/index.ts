import { atom } from 'jotai';
import merge from 'lodash/merge';
import lodashGet from 'lodash/get';

import {
  ParamConfig,
  SynthesisPreviewInterface,
  MModelWorkflowOverrides,
  NeuriteType,
  CanonicalParamsAndDistributions,
  DefaultMModelType,
} from '@/types/m-model';
import { morphologyAssignmentConfigIdAtom } from '@/state/brain-model-config';
import sessionAtom from '@/state/session';
import { fetchResourceById, fetchJsonFileByUrl, fetchResourceByUrl } from '@/api/nexus';
import {
  MorphologyAssignmentConfigResource,
  MorphologyAssignmentConfigPayload,
  CanonicalMorphologyModelConfigPayload,
  CanonicalMorphologyModelConfig,
  CanonicalMorphologyModel,
  NeuronMorphologyModelParameter,
} from '@/types/nexus';
import {
  generateBrainRegionMTypeMapKey,
  generateBrainRegionMTypeArray,
} from '@/util/cell-model-assignment';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { getInitializationValue } from '@/util/utils';
import { DEFAULT_M_MODEL_STORAGE_KEY } from '@/constants/cell-model-assignment/m-model';
import { DEFAULT_BRAIN_REGION_STORAGE_KEY } from '@/constants/brain-hierarchy';
import { DefaultBrainRegionType } from '@/state/brain-regions/types';

const initializationBrainRegion = getInitializationValue<DefaultBrainRegionType>(
  DEFAULT_BRAIN_REGION_STORAGE_KEY
);

const initializationMModel = getInitializationValue<DefaultMModelType>(DEFAULT_M_MODEL_STORAGE_KEY);

const useSavedMModel =
  initializationBrainRegion &&
  initializationBrainRegion.value.id === initializationMModel?.value?.brainRegionId;

export const selectedMModelNameAtom = atom<string | null>(
  useSavedMModel ? initializationMModel.value.name : null
);

export const selectedMModelIdAtom = atom<string | null>(
  useSavedMModel ? initializationMModel.value.id : null
);

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
  const canonicalParamsAndDistribution = get(canonicalParamsAndDistributionAtom);

  return {
    resources: {
      ...(canonicalParamsAndDistribution || {}),
    },
    overrides: localOverrides,
  };
});

export const refetchTriggerAtom = atom<{}>({});

export const configAtom = atom<Promise<MorphologyAssignmentConfigResource | null>>(async (get) => {
  const session = get(sessionAtom);
  const id = await get(morphologyAssignmentConfigIdAtom);

  if (!session || !id) return null;

  return fetchResourceById<MorphologyAssignmentConfigResource>(id, session);
});

export const configPayloadUrlAtom = atom<Promise<string | null>>(async (get) => {
  const config = await get(configAtom);
  if (!config) return null;

  return config.distribution.contentUrl;
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

  if (selectedBrainRegion.leaves) return null;

  return generateBrainRegionMTypeArray(selectedBrainRegion.id, selectedMTypeId);
});

export const localMModelWorkflowOverridesAtom = atom<MModelWorkflowOverrides | null>(null);

export const mModelWorkflowOverridesAtom = atom<Promise<MModelWorkflowOverrides>>(async (get) => {
  const local = get(localMModelWorkflowOverridesAtom);
  const remoteConfigPayload = await get(remoteConfigPayloadAtom);
  const remote = remoteConfigPayload?.configuration.topological_synthesis;

  if (!local) return remote || {};
  return local;
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

  return remoteConfigPayload.defaults.topological_synthesis['@id'];
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

export const canonicalBrainRegionMTypeMapAtom = atom<Promise<Map<string, string | null>>>(
  async (get) => {
    const canonicalBrainRegionIds = await get(canonicalBrainRegionIdsAtom);
    const canonicalMorphologyModelConfig = await get(canonicalMorphologyModelConfigPayloadAtom);

    const canonicalMap = new Map();
    if (!canonicalBrainRegionIds.length || !canonicalMorphologyModelConfig) return canonicalMap;

    canonicalBrainRegionIds.forEach((brainRegionId) => {
      const mTypesPath = ['hasPart', brainRegionId, 'hasPart'];
      const mTypeIds = Object.keys(lodashGet(canonicalMorphologyModelConfig, mTypesPath));
      mTypeIds.forEach((mTypeId) => {
        const canonicalModelPath = [...mTypesPath, mTypeId, 'hasPart'];
        const canonicalModelObj = lodashGet(canonicalMorphologyModelConfig, canonicalModelPath);
        const canonicalModelId = Object.keys(canonicalModelObj)[0];
        canonicalMap.set(generateBrainRegionMTypeMapKey(brainRegionId, mTypeId), canonicalModelId);
      });
    });
    return canonicalMap;
  }
);

export const canonicalMorphologyModelIdAtom = atom<Promise<string | null>>(async (get) => {
  const session = get(sessionAtom);
  const brainRegionMTypeArray = get(brainRegionMTypeArrayAtom);
  const canonicalBrainRegionMTypeMap = await get(canonicalBrainRegionMTypeMapAtom);

  if (!session || !brainRegionMTypeArray) return null;

  const [brainRegionId, mTypeId] = brainRegionMTypeArray;

  const canonicalMorphologyModelConfigPayload = await get(
    canonicalMorphologyModelConfigPayloadAtom
  );
  if (!canonicalMorphologyModelConfigPayload) throw new Error('No canonical payload');

  const brainRegionMTypeKey = generateBrainRegionMTypeMapKey(brainRegionId, mTypeId);
  return canonicalBrainRegionMTypeMap.get(brainRegionMTypeKey) || null;
});

export const canonicalMorphologyModelAtom = atom<Promise<CanonicalMorphologyModel | null>>(
  async (get) => {
    const session = get(sessionAtom);
    const canonicalMorphologyModelId = await get(canonicalMorphologyModelIdAtom);

    if (!session || !canonicalMorphologyModelId) return null;

    return fetchResourceById<CanonicalMorphologyModel>(canonicalMorphologyModelId, session);
  }
);

export const canonicalParamsAndDistributionAtom = atom<CanonicalParamsAndDistributions | null>(
  null
);

export const canonicalModelParametersAtom = atom<Promise<ParamConfig | null>>(async (get) => {
  const session = get(sessionAtom);
  const canonicalMorphologyModel = await get(canonicalMorphologyModelAtom);

  if (!session || !canonicalMorphologyModel) return null;

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
  return fetchResourceByUrl<CanonicalMorphologyModelConfigPayload>(payloadUrl, session);
});
