import { StepsProps } from 'antd/lib/steps';

import { DataType } from '@/constants/explore-section/list-views';

export type SimulationType = 'single-neuron-simulation' | 'synaptome-simulation';

export type SimulationStepTitle =
  | 'Experimental setup'
  | 'Synaptic inputs'
  | 'Stimulation protocol'
  | 'Recording'
  | 'Results';

export type SimulationStep = {
  title: SimulationStepTitle;
  status?: StepsProps['status'];
};

export type SimulationStepsTraker = {
  steps: Array<SimulationStep>;
  current: SimulationStep;
};

type TabDetails = {
  title: string;
  urlParam: string;
};

export const SupportedTypeToTabDetails: Record<string, TabDetails> = {
  [DataType.SingleNeuronSimulation]: {
    title: 'Single neuron simulation',
    urlParam: 'single-neuron-simulation',
  },
  [DataType.SingleNeuronSynaptomeSimulation]: {
    title: 'Synaptome simulations',
    urlParam: 'synaptome-simulation',
  },
};
