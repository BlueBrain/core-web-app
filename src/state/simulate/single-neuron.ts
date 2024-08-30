import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';

import { SelectedSingleNeuronModel } from '@/types/simulation/single-neuron';
import { PlotData } from '@/services/bluenaas-single-cell/types';
import { getIdFromSelfUrl } from '@/util/nexus';
import { SimulationStep, SimulationStepsTraker } from '@/types/simulation/common';

export const defaultSteps: Array<SimulationStep> = [
  { title: 'Experimental setup', status: undefined },
  { title: 'Synaptic inputs', status: undefined },
  { title: 'Stimulation protocol', status: undefined },
  { title: 'Recording', status: undefined },
  { title: 'Results', status: 'wait' },
];

export const simulateStepTrackerAtom = atom<SimulationStepsTraker>({
  steps: defaultSteps,
  current: { title: 'Experimental setup', status: undefined },
});

export const secNamesAtom = atomWithReset<string[]>([]);

export const singleNeuronAtom = atom<SelectedSingleNeuronModel | null>(null);

export const singleNeuronIdAtom = atom<string | null>((get) => {
  const singleNeuronSelfUrl = get(singleNeuronAtom);
  return getIdFromSelfUrl(singleNeuronSelfUrl?.self ?? null);
});

export const simulationStatusAtom = atomWithReset<{
  status: null | 'launched' | 'finished' | 'error';
  description?: string;
} | null>(null);

export const stimulusPreviewPlotDataAtom = atomWithReset<PlotData | null>(null);

export const genericSingleNeuronSimulationPlotDataAtom = atomWithReset<Record<
  string,
  PlotData
> | null>(null);
