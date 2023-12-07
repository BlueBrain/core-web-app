import { atom } from 'jotai';
import lodashSet from 'lodash/set';
import lodashGet from 'lodash/get';
import debounce from 'lodash/debounce';

import {
  configAtom,
  defaultEModelPlaceholderAtom,
  getMETypeIdAtom,
  localConfigPayloadAtom,
  refetchTriggerAtom,
  remoteConfigPayloadAtom,
  selectedMENameAtom,
} from '.';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import {
  eModelByETypeMappingAtom,
  selectedEModelAtom,
} from '@/state/brain-model-config/cell-model-assignment/e-model';
import { MEModelConfigPayload } from '@/types/nexus';
import sessionAtom from '@/state/session';
import { updateJsonFileByUrl, updateResource } from '@/api/nexus';
import { autoSaveDebounceInterval } from '@/config';
import openNotification from '@/api/notifications';
import { createDistribution } from '@/util/nexus';

export const triggerRefetchAtom = atom(null, (get, set) => set(refetchTriggerAtom, {}));

export const setMEConfigPayloadAtom = atom<null, [], void>(null, async (get, set) => {
  const selectedEModel = get(selectedEModelAtom);
  const selectedBrainRegion = get(selectedBrainRegionAtom);
  if (!selectedEModel || !selectedBrainRegion) return;

  const [mTypeId, eTypeId] = await get(getMETypeIdAtom);
  if (!mTypeId || !eTypeId) return;

  const remoteConfigPayload = await get(remoteConfigPayloadAtom);
  if (!remoteConfigPayload) throw new Error('Remote config payload not found');

  let localConfigPayload = get(localConfigPayloadAtom);
  if (!localConfigPayload) {
    localConfigPayload = structuredClone(remoteConfigPayload);
  }

  const path = ['overrides', 'neurons_me_model', selectedBrainRegion.id, mTypeId, eTypeId];

  const eModelData = {
    assignmentAlgorithm: 'assignOne',
    eModel: {
      '@id': selectedEModel.id,
      _rev: selectedEModel.rev,
    },
    axonInitialSegmentAssignment: { fixedValue: { value: 1 } },
  };

  lodashSet(localConfigPayload, path, eModelData);
  set(setConfigPayloadAtom, localConfigPayload);
});

export const unassignFromMEConfigPayloadAtom = atom<null, [], void>(null, async (get, set) => {
  const selectedBrainRegion = get(selectedBrainRegionAtom);
  if (!selectedBrainRegion) return;

  const [mTypeId, eTypeId] = await get(getMETypeIdAtom);
  if (!mTypeId || !eTypeId) return;

  const localConfigPayload = get(localConfigPayloadAtom);
  if (!localConfigPayload) throw new Error('Local config payload not found');

  const path = ['overrides', 'neurons_me_model', selectedBrainRegion.id, mTypeId, eTypeId];
  if (!lodashGet(localConfigPayload, path)) return;

  const newPayload = structuredClone(localConfigPayload);

  const brainRegionObject = newPayload.overrides.neurons_me_model[selectedBrainRegion.id];
  const mTypeObject = brainRegionObject[mTypeId];

  delete mTypeObject[eTypeId];

  // cleanup empty objects after deletion
  if (Object.keys(mTypeObject).length === 0) {
    delete brainRegionObject[mTypeId];

    if (Object.keys(brainRegionObject).length === 0) {
      delete newPayload.overrides.neurons_me_model[selectedBrainRegion.id];
    }
  }

  set(setConfigPayloadAtom, newPayload);
  set(setDefaultEModelForMETypeAtom);
});

export const setDefaultEModelForMETypeAtom = atom<null, [], void>(null, async (get, set) => {
  const localConfigPayload = get(localConfigPayloadAtom);
  const selectedBrainRegion = get(selectedBrainRegionAtom);
  const eModels = await get(eModelByETypeMappingAtom);
  if (!eModels || !selectedBrainRegion) return;

  const [mTypeId, eTypeId] = await get(getMETypeIdAtom);
  if (!mTypeId || !eTypeId) return;

  const [mTypeName, eTypeName] = get(selectedMENameAtom);
  if (!mTypeName || !eTypeName) return;

  const path = [
    'overrides',
    'neurons_me_model',
    selectedBrainRegion.id,
    mTypeId,
    eTypeId,
    'eModel',
    '@id',
  ];
  const eModelIdInPayload: string | undefined = lodashGet(localConfigPayload, path);
  const availableEModels = eModels[eTypeName];

  if (!eModelIdInPayload) {
    // if no eModel was selected in the past, use default placeholders from remote
    const defaultEModelPlaceholder = await get(defaultEModelPlaceholderAtom);
    if (!defaultEModelPlaceholder) return;

    const defaultEModelId = Object.keys(defaultEModelPlaceholder)[0];
    const defaultEModelRev = defaultEModelPlaceholder[defaultEModelId]._rev;

    const foundEModel = availableEModels.find((eModel) => eModel.id === defaultEModelId);
    if (!foundEModel) {
      throw new Error('Default placeholder eModel not found in available eModels');
    }
    if (foundEModel?.rev !== defaultEModelRev) {
      throw new Error('Revision between default placeholder and available eModels does not match');
    }

    set(selectedEModelAtom, { ...foundEModel, mType: mTypeName, eType: eTypeName });
    return;
  }

  // if eModel was selected in the past, reuse it as selected in dropdown
  const savedEModel = availableEModels.find((eModel) => eModel.id === eModelIdInPayload);
  if (!savedEModel) throw new Error('Previously used eModel not found in available eModels');

  set(selectedEModelAtom, { ...savedEModel, mType: mTypeName, eType: eTypeName });
});

export const updateConfigPayloadAtom = atom<null, [MEModelConfigPayload], Promise<void>>(
  null,
  async (get, set, configPayload) => {
    const session = get(sessionAtom);
    const config = await get(configAtom);

    const url = config?.distribution.contentUrl;

    if (!session) {
      throw new Error('No auth session found in the state');
    }

    if (!url) {
      throw new Error('No id found for meModelConfig');
    }

    if (!config) return;

    const updatedFile = await updateJsonFileByUrl(
      url,
      configPayload,
      'me-model-config.json',
      session
    );

    config.distribution = createDistribution(updatedFile);

    await updateResource(config, session);
    openNotification('success', 'The me-model config was successfully saved');
  }
);

const triggerUpdateDebouncedAtom = atom<null, [MEModelConfigPayload], Promise<void>>(
  null,
  debounce(
    (get, set, configPayload) => set(updateConfigPayloadAtom, configPayload),
    autoSaveDebounceInterval
  )
);

const setConfigPayloadAtom = atom<null, [MEModelConfigPayload], void>(
  null,
  (get, set, configPayload: MEModelConfigPayload) => {
    set(localConfigPayloadAtom, configPayload);
    set(triggerUpdateDebouncedAtom, configPayload);
  }
);
