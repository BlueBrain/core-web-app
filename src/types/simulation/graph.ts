import { StimulusModule } from './single-neuron';

export type DirectCurrentInjectionGraphRequest = {
  stimulusProtocol: StimulusModule;
  amplitudes: number[];
};

export type DirectCurrentInjectionGraphPlotResponse = {
  x: number[];
  y: number[];
  name: string;
};

export type SimulationPlotResponse = {
  t: number[];
  v: number[];
  stimulus_name: string;
  recording_name: string;
  amplitude: number;
};
