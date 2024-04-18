import { atom } from 'jotai';
import { atomWithReducer } from 'jotai/utils';
import { MutableRefObject } from 'react';

import { simReducer } from './redurcers';
import { SimAction, SimConfig, SimulateStep } from '@/types/simulate/single-neuron';
import { DEFAULT_SIM_CONFIG } from '@/constants/simulate/single-neuron';
import { PlotData } from '@/services/bluenaas-single-cell/types';
import BlueNaasCls from '@/services/bluenaas-single-cell/blue-naas';

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

export const blueNaasInstanceRefAtom = atom<MutableRefObject<BlueNaasCls | null> | null>(null);

export const simulationPlotDataAtom = atom<PlotData | null>(null);

export const protocolNameAtom = atom<string | null>((get) => {
  const simulationConfig = get(simulationConfigAtom);
  return simulationConfig.stimulus.stimulusProtocol;
});
