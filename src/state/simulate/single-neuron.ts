import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';

import { directCurrentInjectionSimulationConfigAtom } from './categories/direct-current-injection-simulation';
import { SelectedSingleNeuronModel, StimulusModule } from '@/types/simulation/single-neuron';
import { PlotData } from '@/services/bluenaas-single-cell/types';
import { getIdFromSelfUrl } from '@/util/nexus';
import { SimulationStep, SimulationStepsTraker } from '@/types/simulation/common';

export const steps: Array<SimulationStep> = [
  { title: 'stimulation', status: undefined },
  { title: 'recording', status: undefined },
  { title: 'conditions', status: undefined },
  { title: 'analysis', status: undefined },
  { title: 'visualization', status: undefined },
  { title: 'results', status: undefined },
];

export const simulateStepTrackerAtom = atom<SimulationStepsTraker>({
  steps,
  current: { title: 'stimulation', status: undefined },
});

export const secNamesAtom = atomWithReset<string[]>([]);

export const segNamesAtom = atom<string[]>(['soma[0]', 'axon[1]']);

export const singleNeuronAtom = atom<SelectedSingleNeuronModel | null>(null);

export const singleNeuronIdAtom = atom<string | null>((get) => {
  const singleNeuronSelfUrl = get(singleNeuronAtom);
  return getIdFromSelfUrl(singleNeuronSelfUrl?.self ?? null);
});

export const simulationStatusAtom = atomWithReset<{
  status: null | 'launched' | 'finished' | 'error';
  description?: string;
} | null>(null);

export const protocolNameAtom = atom<StimulusModule | null>((get) => {
  const directCurrentStimulation = get(directCurrentInjectionSimulationConfigAtom);
  return directCurrentStimulation?.[0].stimulus.stimulusProtocol ?? null; // TODO: The index here should not be hardcoded when synaptome rendering is done.
});

export const stimulusPreviewPlotDataAtom = atomWithReset<
  Array<{
    id: string;
    data: PlotData;
  }>
>([]);

export const genericSingleNeuronSimulationPlotDataAtom = atomWithReset<PlotData | null>(null);
