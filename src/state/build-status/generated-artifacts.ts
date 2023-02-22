import { atom } from 'jotai/vanilla';

import { cellCompositionAtom as cellCompositionPartialCircuitAtom } from '@/state/brain-model-config/cell-composition';
import { partialCircuitAtom as cellPositionPartialCircuitAtom } from '@/state/brain-model-config/cell-position';
import { partialCircuitAtom as emodelAssignmentPartialCircuitAtom } from '@/state/brain-model-config/emodel-assignment';
import { partialCircuitAtom as morphologyAssignmentPartialCircuitAtom } from '@/state/brain-model-config/morphology-assignment';

export const cellCompositionWasBuiltAtom = atom<Promise<boolean>>(async (get) => {
  const compositionHasLink = await get(cellCompositionPartialCircuitAtom);

  return !!compositionHasLink;
});

export const cellPositionWasBuiltAtom = atom<Promise<boolean>>(async (get) => {
  const compositionHasLink = await get(cellCompositionWasBuiltAtom);
  const data = await get(cellPositionPartialCircuitAtom);

  return !!compositionHasLink && !!data;
});

export const emodelAssignmentWasBuiltAtom = atom<Promise<boolean>>(async (get) => {
  const compositionHasLink = await get(cellCompositionWasBuiltAtom);
  const data = await get(emodelAssignmentPartialCircuitAtom);

  return !!compositionHasLink && !!data;
});

export const morphologyAssignmentWasBuiltAtom = atom<Promise<boolean>>(async (get) => {
  const compositionHasLink = await get(cellCompositionWasBuiltAtom);
  const data = await get(morphologyAssignmentPartialCircuitAtom);

  return !!compositionHasLink && !!data;
});

export default {};
