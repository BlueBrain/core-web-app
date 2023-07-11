import { atom } from 'jotai';

import { cellCompositionAtom } from '@/state/brain-model-config/cell-composition';
import { partialCircuitAtom as cellPositionPartialCircuitAtom } from '@/state/brain-model-config/cell-position';
import { partialCircuitAtom as emodelAssignmentPartialCircuitAtom } from '@/state/brain-model-config/emodel-assignment';
import { partialCircuitAtom as morphologyAssignmentPartialCircuitAtom } from '@/state/brain-model-config/cell-model-assignment/m-model';
import { partialCircuitAtom as microConnectomePartialCircuitAtom } from '@/state/brain-model-config/micro-connectome';

export const cellCompositionWasBuiltAtom = atom<Promise<boolean>>(async (get) => {
  const cellComposition = await get(cellCompositionAtom);

  return !!cellComposition;
});

export const cellPositionWasBuiltAtom = atom<Promise<boolean>>(async (get) => {
  const circuit = await get(cellPositionPartialCircuitAtom);

  return !!circuit;
});

export const emodelAssignmentWasBuiltAtom = atom<Promise<boolean>>(async (get) => {
  const circuit = await get(emodelAssignmentPartialCircuitAtom);

  return !!circuit;
});

export const morphologyAssignmentWasBuiltAtom = atom<Promise<boolean>>(async (get) => {
  const circuit = await get(morphologyAssignmentPartialCircuitAtom);

  return !!circuit;
});

export const microConnectomeWasBuiltAtom = atom<Promise<boolean>>(async (get) => {
  const circuit = await get(microConnectomePartialCircuitAtom);

  return !!circuit;
});
