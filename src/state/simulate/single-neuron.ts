import { atom } from 'jotai';
import { atomWithReducer, atomWithReset } from 'jotai/utils';

import { simReducer } from './redurcers';
import {
  SelectedSingleNeuronModel,
  SimAction,
  SimConfig,
  SimulateStep,
} from '@/types/simulate/single-neuron';
import { DEFAULT_SIM_CONFIG } from '@/constants/simulate/single-neuron';
import { PlotData } from '@/services/bluenaas-single-cell/types';
import { getIdFromSelfUrl } from '@/util/nexus';

export const simulateStepAtom = atom<SimulateStep>('stimulation');

export const simulationConfigAtom = atomWithReducer<SimConfig, SimAction>(
  { ...DEFAULT_SIM_CONFIG },
  simReducer
);

export const secNamesAtom = atomWithReset<string[]>([]);

export const segNamesAtom = atom<string[]>(['soma[0]', 'axon[1]']);

export const singleNeuronAtom = atom<SelectedSingleNeuronModel | null>(null);

export const singleNeuronIdAtom = atom<string | null>((get) => {
  const singleNeuronSelfUrl = get(singleNeuronAtom);
  return getIdFromSelfUrl(singleNeuronSelfUrl?.self ?? null);
});

export const simulationStatusAtom = atomWithReset({
  launched: false,
  finished: false,
});

export const simulationFormIsFilledAtom = atomWithReset(false);

export const simulationPlotDataAtom = atomWithReset<PlotData | null>(null);

export const protocolNameAtom = atom<string | null>((get) => {
  const simulationConfig = get(simulationConfigAtom);
  return simulationConfig.directStimulation?.[0].stimulus.stimulusProtocol ?? null; // TODO: The index here should not be hardcoded when synaptome rendering is done.
});
