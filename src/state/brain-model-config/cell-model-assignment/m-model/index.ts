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
} from '@/api/nexus';
import {
  MorphologyAssignmentConfigResource,
  DetailedCircuitResource,
  GeneratorTaskActivityResource,
  MorphologyAssignmentConfig,
  MorphologyAssignmentConfigPayload,
} from '@/types/nexus';
import { setRevision } from '@/util/nexus';
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

export const accumulativeLocalTopologicalSynthesisParamsAtom = atom<MModelWorkflowOverrides>({});

export const selectedCanonicalMapAtom = atom<Map<string, boolean>>((get) => {
  const accumulativeTopologicalSynthesis = get(accumulativeLocalTopologicalSynthesisParamsAtom);
  const brainRegionIds = Object.keys(accumulativeTopologicalSynthesis);
  const selectedCanonicalMap = new Map();
  brainRegionIds.forEach((brainRegionId) => {
    const mTypeIds = Object.keys(accumulativeTopologicalSynthesis[brainRegionId]);
    mTypeIds.forEach((mTypeId) => {
      selectedCanonicalMap.set(`${brainRegionId}<>${mTypeId}`, true);
    });
  });
  return selectedCanonicalMap;
});
