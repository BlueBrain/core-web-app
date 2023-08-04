import { MModelMenuItem } from './m-model';

export interface EModel {
  label: string;
  id: string;
  mType: MModelMenuItem;
}

export interface EModelMenuItem extends EModel {
  annotation?: string;
  uuid: string;
}

export type SimulationParameterKeys = 'Temperature' | 'Ra' | 'Calcium' | 'XXXX';
export type SimulationParameter = Record<SimulationParameterKeys, number>;

export type FeaturesCategories = 'Spike shape' | 'Spike event' | 'Voltage';
export type FeaturesKeys =
  | 'decay_time_constant_after_sim'
  | 'maximum_voltage'
  | 'maximum_voltage_from_voltagebase'
  | 'min_AHP-indices'
  | 'min_AHP-values'
  | 'min_voltage_between_spikes'
  | 'minimum_voltage'
  | 'peak_indices'
  | 'steady_state_hyper'
  | 'steady_state_voltage'
  | 'steady_state_voltage_stimend'
  | 'trace_check'
  | 'voltage'
  | 'voltage_after_stim'
  | 'voltage_base'
  | 'voltage_deflection'
  | 'voltage_deflection_begin'
  | 'voltage_deflection_vb_ssse';
export type FeatureParameterItem = {
  parameterName: FeaturesKeys;
  selected: boolean;
};
export type FeatureParameterGroup = Record<FeaturesCategories, FeatureParameterItem[]>;

export interface ExamplarMorphologyDataType {
  name: string;
  description: string;
  brainLocation: string;
  mType: string;
  contributor: string;
}

export interface ExperimentalTracesDataType {
  cellName: string;
  mType: string;
  eType: string;
  description: string;
  eCode: string;
  subjectSpecies: string;
}
