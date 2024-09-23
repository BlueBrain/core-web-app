import { StimulusModule } from './single-neuron';

export type CurrentInjectionGraphRequest = {
  stimulusProtocol: StimulusModule;
  amplitudes: number[];
};

export type CurrentInjectionGraphResponse = {
  x: number[];
  y: number[];
  name: string;
  amplitude: number;
};

export type SimulationPlotResponse = {
  t: number[];
  v: number[];
  stimulus_name: string;
  recording_name: string;
  amplitude: number;
  frequency?: number;
};
