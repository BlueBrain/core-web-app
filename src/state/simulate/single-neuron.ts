import { atom } from 'jotai';
import { atomWithReducer } from 'jotai/utils';

import { simReducer } from './redurcers';
import { SimAction, SimConfig, SimulateStep } from '@/types/simulate/single-neuron';
import { DEFAULT_SIM_CONFIG } from '@/constants/simulate/single-neuron';

export const simulateStepAtom = atom<SimulateStep>('stimulation');

export const simulationConfigAtom = atomWithReducer<SimConfig, SimAction>(
  { ...DEFAULT_SIM_CONFIG },
  simReducer
);

export const secNamesAtom = atom<string[]>([]);

export const segNamesAtom = atom<string[]>(['soma[0]', 'axon[1]']);

export const simulationResultsAtom = atom([1]);

export const singleNeuronIdAtom = atom<string | null>('123');

export const simulationStatusAtom = atom({
  launched: false,
  finished: false,
});

export const simulationFormIsFilledAtom = atom(false);
