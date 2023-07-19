import { atom } from 'jotai';
import merge from 'lodash/merge';
import lodashGet from 'lodash/get';

import { ParamConfig, SynthesisPreviewInterface, MModelWorkflowOverrides } from '@/types/m-model';
import { morphologyAssignmentConfigIdAtom } from '@/state/brain-model-config';
import sessionAtom from '@/state/session';
import {
  fetchResourceById,
  fetchGeneratorTaskActivity,
  fetchResourceSourceById,
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
import {
  initialMorphologyAssigmentConfigPayload,
  paramsAndDistResources,
} from '@/constants/cell-model-assignment/m-model';
import { expandBrainRegionId, generateBrainMTypeMapKey } from '@/util/cell-model-assignment';
import { selectedBrainRegionAtom } from '@/state/brain-regions';

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

export const accumulativeTopologicalSynthesisParamsAtom = atom<Promise<MModelWorkflowOverrides>>(
  async (get) => {
    const local = get(accumulativeLocalTopologicalSynthesisParamsAtom);
    const remoteConfigPayload = await get(remoteConfigPayloadAtom);
    const remote = remoteConfigPayload?.configuration.topological_synthesis;
    return { ...remote, ...local };
  }
);

export const selectedCanonicalMapAtom = atom<Promise<Map<string, boolean>>>(async (get) => {
  const accumulativeTopologicalSynthesis = await get(accumulativeTopologicalSynthesisParamsAtom);
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

export const remoteOverridesAtom = atom<Promise<ParamConfig | {}>>(async (get) => {
  const remoteConfigPayload = await get(remoteConfigPayloadAtom);
  const brainRegion = get(selectedBrainRegionAtom);
  const mTypeId = get(selectedMModelIdAtom);

  if (!brainRegion || !mTypeId) return {};

  if (brainRegion.leaves || !brainRegion.representedInAnnotation) return {};

  const expandedBrainRegionId = expandBrainRegionId(brainRegion.id);

  if (!remoteConfigPayload) return {};

  const workflowOverrides = remoteConfigPayload.configuration.topological_synthesis;
  const path = [expandedBrainRegionId, mTypeId, 'overrides'];
  const brainMTypeOverrides = lodashGet(workflowOverrides, path);
  return brainMTypeOverrides || {};
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

export const canonicalBrainRegionIdsAtom = atom<Promise<string[]>>(async (get) => {
  const canonicalMorphologyModelConfig = await get(canonicalMorphologyModelConfigPayloadAtom);

  if (!canonicalMorphologyModelConfig) return [];

  return Object.keys(canonicalMorphologyModelConfig.hasPart);
});

export const canonicalMapAtom = atom<Promise<Map<string, boolean>>>(async (get) => {
  const canonicalBrainRegionIds = await get(canonicalBrainRegionIdsAtom);
  const canonicalMorphologyModelConfig = await get(canonicalMorphologyModelConfigPayloadAtom);

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

export const canonicalModelParametersAtom = atom<Promise<ParamConfig | null>>(async (get) => {
  const session = get(sessionAtom);
  const brainRegion = get(selectedBrainRegionAtom);
  const mTypeId = get(selectedMModelIdAtom);

  if (!brainRegion || !mTypeId) return null;

  if (brainRegion.leaves || !brainRegion.representedInAnnotation) return null;

  const expandedBrainRegionId = expandBrainRegionId(brainRegion.id);

  const canonicalMorphologyModelConfigPayload = await get(
    canonicalMorphologyModelConfigPayloadAtom
  );
  if (!canonicalMorphologyModelConfigPayload) throw new Error('No canonical payload');

  const canonicalMorphologyModelId = Object.keys(
    canonicalMorphologyModelConfigPayload.hasPart[expandedBrainRegionId].hasPart[mTypeId].hasPart
  )[0];

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
    remoteCanonicalMorphologyModelConfigPayloadAtom
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
      mTypeParentDict[`${mTypeId}?rev=${data.rev}`] = data;
      delete mTypeParentDict[mTypeId];
    });
  });

  return processedPayload;
});
