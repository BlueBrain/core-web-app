import { atom } from 'jotai';
import { atomWithReducer, atomWithReset } from 'jotai/utils';
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

export const secNamesAtom = atomWithReset<string[]>([]);

export const segNamesAtom = atom<string[]>(['soma[0]', 'axon[1]']);

export const singleNeuronSelfUrlAtom = atom<string | null>(null);

export const singleNeuronIdAtom = atom<string | null>((get) => {
  const singleNeuronSelfUrl = get(singleNeuronSelfUrlAtom);
  const encodedId = singleNeuronSelfUrl?.split('/').at(-1);
  const decodedId = decodeURIComponent(encodedId || '');

  return decodedId || null;
});

export const simulationStatusAtom = atomWithReset({
  launched: false,
  finished: false,
});

export const simulationFormIsFilledAtom = atomWithReset(false);

export const blueNaasInstanceRefAtom = atom<MutableRefObject<BlueNaasCls | null> | null>(null);

export const simulationPlotDataAtom = atomWithReset<PlotData | null>(null);

export const protocolNameAtom = atom<string | null>((get) => {
  const simulationConfig = get(simulationConfigAtom);
  return simulationConfig.stimulus.stimulusProtocol;
});
