import { atom } from 'jotai';

import { SimulateStep } from '@/types/simulate/single-neuron';

export const simulateStepAtom = atom<SimulateStep>('stimulation');
