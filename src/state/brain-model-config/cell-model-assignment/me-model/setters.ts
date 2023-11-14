import { atom } from 'jotai';
import lodashSet from 'lodash/set';
import lodashGet from 'lodash/get';

import {
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
    set(selectedEModelAtom, { ...availableEModels[0], mType: mTypeName, eType: eTypeName });
    return;
  }

  // if eModel was selected in the past, reuse it as selected in dropdown
  const savedEModel = availableEModels.find((eModel) => eModel.id === eModelIdInPayload);
  if (!savedEModel) return;
  set(selectedEModelAtom, { ...savedEModel, mType: mTypeName, eType: eTypeName });
});
