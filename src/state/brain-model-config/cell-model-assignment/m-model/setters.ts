import { atom } from 'jotai';
import debounce from 'lodash/debounce';
import lodashSet from 'lodash/set';
import lodashGet from 'lodash/get';

import {
  mModelRemoteParamsAtom,
  mModelRemoteParamsLoadedAtom,
  refetchTriggerAtom,
  configPayloadRevAtom,
  configAtom,
  mModelLocalParamsAtom,
  localMModelWorkflowOverridesAtom,
  cachedDefaultParamsMapAtom,
  canonicalModelParametersAtom,
  remoteParamsAtom,
  mModelWorkflowOverridesAtom,
  canonicalMorphologyModelIdAtom,
  remoteConfigPayloadAtom,
  brainRegionMTypeArrayAtom,
  canonicalMorphologyModelAtom,
  canonicalParamsAndDistributionAtom,
} from '.';
import { ChangeModelAction, ParamConfig } from '@/types/m-model';
import sessionAtom from '@/state/session';
import { updateJsonFileByUrl, updateResource } from '@/api/nexus';
import { MorphologyAssignmentConfigPayload } from '@/types/nexus';
import { autoSaveDebounceInterval } from '@/config';
import { createGeneratorConfig, setRevision } from '@/util/nexus';
import invalidateConfigAtom from '@/state/brain-model-config/util';
import {
  generateBrainRegionMTypeMapKey,
  generateBrainRegionMTypeArray,
} from '@/util/cell-model-assignment';

export const triggerRefetchAtom = atom(null, (get, set) => set(refetchTriggerAtom, {}));

export const updateConfigPayloadAtom = atom<
  null,
  [MorphologyAssignmentConfigPayload],
  Promise<void>
>(null, async (get, set, configPayload) => {
  const session = get(sessionAtom);
  const rev = await get(configPayloadRevAtom);
  const config = await get(configAtom);

  const url = setRevision(config?.distribution.contentUrl, rev);

  if (!session) {
    throw new Error('No auth session found in the state');
  }

  if (!rev) {
    throw new Error('No revision found in the morphology assigment config state');
  }

  if (!url) {
    throw new Error('No id found for morphologyAssigmentConfig');
  }

  if (!config) return;

  const updatedFile = await updateJsonFileByUrl(
    url,
    configPayload,
    'morphology-assignment-config.json',
    session
  );

  config.distribution = createGeneratorConfig({
    kgType: 'MorphologyAssignmentConfig',
    payloadMetadata: updatedFile,
  }).distribution;

  await updateResource(config, config?._rev, session);
  await set(invalidateConfigAtom, 'morphologyAssignment');
  set(triggerRefetchAtom);
});

const triggerUpdateDebouncedAtom = atom<null, [MorphologyAssignmentConfigPayload], Promise<void>>(
  null,
  debounce(
    (get, set, configPayload) => set(updateConfigPayloadAtom, configPayload),
    autoSaveDebounceInterval
  )
);

const setConfigPayloadAtom = atom<null, [MorphologyAssignmentConfigPayload], void>(
  null,
  (get, set, configPayload: MorphologyAssignmentConfigPayload) => {
    set(triggerUpdateDebouncedAtom, configPayload);
  }
);

export const fetchMModelRemoteParamsAtom = atom<null, [], Promise<ParamConfig | null>>(
  null,
  async (get, set) => {
    const brainRegionMTypeArray = get(brainRegionMTypeArrayAtom);

    if (!brainRegionMTypeArray) return null;

    const [brainRegionId, mTypeId] = brainRegionMTypeArray;

    const cachedDefaultParamsMap = get(cachedDefaultParamsMapAtom);
    const brainMTypeMapKey = generateBrainRegionMTypeMapKey(brainRegionId, mTypeId);
    const fetchedInfo = cachedDefaultParamsMap?.get(brainMTypeMapKey);

    if (fetchedInfo) {
      const accumulative = await get(mModelWorkflowOverridesAtom);
      const path = [...brainRegionMTypeArray, 'overrides'];
      const localOverrides = lodashGet(accumulative, path);

      set(mModelLocalParamsAtom, localOverrides || {});
      set(mModelRemoteParamsAtom, fetchedInfo);
      set(mModelRemoteParamsLoadedAtom, true);
      set(setCanonicalAndDistributionsAtom);
      return fetchedInfo;
    }

    const params = await get(canonicalModelParametersAtom);
    if (!params) throw new Error('No canonical parameters were found');

    const remoteOverrides = await get(remoteParamsAtom);
    set(mModelLocalParamsAtom, remoteOverrides);
    set(mModelRemoteParamsAtom, params);
    cachedDefaultParamsMap.set(brainMTypeMapKey, params);
    set(cachedDefaultParamsMapAtom, cachedDefaultParamsMap);
    set(mModelRemoteParamsLoadedAtom, true);
    set(setCanonicalAndDistributionsAtom);
    return params;
  }
);

export const setMModelLocalTopologicalSynthesisParamsAtom = atom<null, [], void>(
  null,
  async (get, set) => {
    const brainRegionMTypeArray = get(brainRegionMTypeArrayAtom);

    if (!brainRegionMTypeArray) return;

    const [brainRegionId, mTypeId] = brainRegionMTypeArray;

    await set(setAccumulativeTopologicalSynthesisAtom, brainRegionId, mTypeId, 'add');
  }
);

export const setAccumulativeTopologicalSynthesisAtom = atom<
  null,
  [string, string, ChangeModelAction],
  void
>(null, async (get, set, brainRegionId, mTypeId, action) => {
  const overrides = get(mModelLocalParamsAtom);
  const accumulative = structuredClone(await get(mModelWorkflowOverridesAtom));

  if (action === 'remove') {
    delete accumulative[brainRegionId][mTypeId];
    set(localMModelWorkflowOverridesAtom, accumulative);
    return;
  }

  const canonicalMorphologyModelId = await get(canonicalMorphologyModelIdAtom);
  lodashSet(accumulative, generateBrainRegionMTypeArray(brainRegionId, mTypeId), {
    id: canonicalMorphologyModelId,
    overrides,
  });
  set(localMModelWorkflowOverridesAtom, accumulative);
});

export const setMorphologyAssignmentConfigPayloadAtom = atom<null, [], void>(
  null,
  async (get, set) => {
    await set(setMModelLocalTopologicalSynthesisParamsAtom);
    const remoteConfigPayload = await get(remoteConfigPayloadAtom);
    const topologicalSynthesisParams = await get(mModelWorkflowOverridesAtom);

    if (!remoteConfigPayload || !topologicalSynthesisParams) return;

    const updatedConfigPayload: MorphologyAssignmentConfigPayload = {
      ...remoteConfigPayload,
    };

    updatedConfigPayload.configuration.topological_synthesis = {
      ...topologicalSynthesisParams,
    };

    await set(setConfigPayloadAtom, updatedConfigPayload);
  }
);

export const setCanonicalAndDistributionsAtom = atom<null, [], void>(null, async (get, set) => {
  const session = get(sessionAtom);
  const canonicalMorphologyModel = await get(canonicalMorphologyModelAtom);

  if (!session || !canonicalMorphologyModel) return;

  set(canonicalParamsAndDistributionAtom, {
    parameters_id: canonicalMorphologyModel.morphologyModelParameter['@id'],
    distributions_id: canonicalMorphologyModel.morphologyModelDistribution['@id'],
  });
});
