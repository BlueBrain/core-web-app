import { StepsProps } from 'antd/lib/steps';

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
