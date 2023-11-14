import { atom } from 'jotai';

import { MEFeatureWithEModel } from '@/types/me-model';
import { MEModelConfigPayload } from '@/types/nexus';
import { analysedETypesAtom } from '@/state/build-composition';
import { defaultMEModelConfigPayload } from '@/constants/cell-model-assignment/me-model';

export const refetchTriggerAtom = atom<{}>({});

export const featureWithEModelAtom = atom<MEFeatureWithEModel | null>(null);

export const selectedMENameAtom = atom<[string, string] | [null, null]>([null, null]);

export const mEModelConfigPayloadAtom = atom<MEModelConfigPayload>(defaultMEModelConfigPayload);

export const getMETypeIdAtom = atom<Promise<[string, string] | [null, null]>>(async (get) => {
  const selectedMEName = get(selectedMENameAtom);
  if (!selectedMEName) return [null, null];

  const [mTypeName, eTypeName] = selectedMEName;
  if (!mTypeName || !eTypeName) return [null, null];

  const mEModelItems = await get(analysedETypesAtom);

  const mTypeId = mEModelItems[mTypeName].mTypeInfo.id;
  const eTypesInfo = mEModelItems[mTypeName].eTypeInfo;
  const eTypeId = eTypesInfo.find((eType) => eType.eType === eTypeName)?.id;
  if (!mTypeId || !eTypeId) return [null, null];

  return [mTypeId, eTypeId];
});
