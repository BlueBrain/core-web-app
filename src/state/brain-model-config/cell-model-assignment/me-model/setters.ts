import { atom } from 'jotai';
import lodashSet from 'lodash/set';
import lodashGet from 'lodash/get';

import {
  defaultEModelPlaceholderAtom,
  getMETypeIdAtom,
  mEModelConfigPayloadAtom,
  refetchTriggerAtom,
  selectedMENameAtom,
} from '.';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import {
  eModelByETypeMappingAtom,
  selectedEModelAtom,
} from '@/state/brain-model-config/cell-model-assignment/e-model';

export const triggerRefetchAtom = atom(null, (get, set) => set(refetchTriggerAtom, {}));

export const setMEConfigPayloadAtom = atom<null, [], void>(null, async (get, set) => {
  const selectedEModel = get(selectedEModelAtom);
  const selectedBrainRegion = get(selectedBrainRegionAtom);
  if (!selectedEModel || !selectedBrainRegion) return;

  const [mTypeId, eTypeId] = await get(getMETypeIdAtom);
  if (!mTypeId || !eTypeId) return;

  const payload = structuredClone(await get(mEModelConfigPayloadAtom));

  const path = ['overrides', 'neurons_me_model', selectedBrainRegion.id, mTypeId, eTypeId];

  const eModelData = {
    assignmentAlgorithm: 'assignOne',
    eModel: {
      '@id': selectedEModel.id,
      _rev: selectedEModel.rev,
    },
    axonInitialSegmentAssignment: { fixedValue: { value: 1 } },
  };

  lodashSet(payload, path, eModelData);

  set(mEModelConfigPayloadAtom, payload);
});

export const setDefaultEModelForMETypeAtom = atom<null, [], void>(null, async (get, set) => {
  const mEModelConfigPayload = get(mEModelConfigPayloadAtom);
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
  const eModelIdInPayload: string | undefined = lodashGet(mEModelConfigPayload, path);
  const availableEModels = eModels[eTypeName];

  if (!eModelIdInPayload) {
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
  if (!savedEModel) return;
  set(selectedEModelAtom, { ...savedEModel, mType: mTypeName, eType: eTypeName });
});
