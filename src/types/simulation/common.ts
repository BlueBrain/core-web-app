import { StepsProps } from 'antd/lib/steps';

export type SimulationType = 'single-neuron-simulation' | 'synaptome-simulation';

export type SimulationStepTitle =
  | 'stimulation'
  | 'recording'
  | 'conditions'
  | 'analysis'
  | 'visualization'
  | 'results';

export type SimulationStep = {
  title: SimulationStepTitle;
  status?: StepsProps['status'];
};

export type SimulationStepsTraker = {
  steps: Array<SimulationStep>;
  current: SimulationStep;
};
