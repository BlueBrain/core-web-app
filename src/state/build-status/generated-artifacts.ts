import { atom } from 'jotai';

import { cellCompositionAtom } from '@/state/brain-model-config/cell-composition';
import { partialCircuitAtom as cellPositionPartialCircuitAtom } from '@/state/brain-model-config/cell-position';
import { partialCircuitAtom as meModelPartialCircuitAtom } from '@/state/brain-model-config/me-model';
import { partialCircuitAtom as morphologyAssignmentPartialCircuitAtom } from '@/state/brain-model-config/cell-model-assignment/m-model';
import {
  partialCircuitAtom as microConnectomePartialCircuitAtom,
  partialCircuitAtom as macroConnectomePartialCircuitAtom,
} from '@/state/brain-model-config/micro-connectome';
import { partialCircuitAtom as synapsePartialCircuitAtom } from '@/state/brain-model-config/synapse-editor';

export const cellCompositionWasBuiltAtom = atom<Promise<boolean>>(async (get) => {
  const cellComposition = await get(cellCompositionAtom);

  return !!cellComposition;
});

export const cellPositionWasBuiltAtom = atom<Promise<boolean>>(async (get) => {
  const circuit = await get(cellPositionPartialCircuitAtom);

  return !!circuit;
});

export const meModelWasBuiltAtom = atom<Promise<boolean>>(async (get) => {
  const circuit = await get(meModelPartialCircuitAtom);

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

export const macroConnectomeWasBuiltAtom = atom<Promise<boolean>>(async (get) => {
  const circuit = await get(macroConnectomePartialCircuitAtom);

  return !!circuit;
});

export const synapseWasBuiltAtom = atom<Promise<boolean>>(async (get) => {
  const circuit = await get(synapsePartialCircuitAtom);

  return !!circuit;
});
