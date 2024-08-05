import { ExploreResource, MEModelSynaptome } from '../explore-section/es';
import { SynaptomeModelResource } from '../explore-section/delta-model';
import { MEModelResource } from '../me-model';
import { DataType } from '@/constants/explore-section/list-views';
import { PlotData } from '@/services/bluenaas-single-cell/types';

export type SimulateStep =
  | 'stimulation'
  | 'recording'
  | 'conditions'
  | 'analysis'
  | 'visualization'
  | 'results';

// ------------------ Stimulation protocols types ------------------

export type StimulusType = 'current_clamp' | 'voltage_clamp' | 'conductance';

export type StimulusModule = 'ap_waveform' | 'idrest' | 'iv' | 'fire_pattern';

export type StimulusTypeDropdownOptionType = {
  label: string;
  value: StimulusType;
};

export type StimulusModuleDropdownOptionType = {
  label: string;
  value: StimulusModule;
  usedBy: StimulusType[];
  description: string;
  duration: number;
};

type FunctionParameter = {
  name: string;
  description: string;
  unit: string | null;
  disabled?: boolean;
  hidden?: boolean;
};

export type FunctionParameterNumber = FunctionParameter & {
  defaultValue: number;
  min: number;
  max: number;
  step: number;
};

export type StimulusParameter = Record<string, FunctionParameterNumber>;

export type ConditionalStimulusParamsTypes = Record<StimulusModule, StimulusParameter>;

export type StimulusDropdownInfo = {
  name: string;
  value: string;
};

export type SynapsesConfig = SynapseConfig[];

export interface SimConfig {
  recordFrom: string[];
  directStimulation: null | DirectSimulationConfig[];
  synapses: null | SynapsesConfig;
}

export interface DirectSimulationConfig {
  id: string;
  celsius: number;
  hypamp: number;
  vinit: number;
  injectTo: string;
  stimulus: StimulusConfig;
}

export type SynapseConfig = {
  id: string;
  synapseId: string;
  delay: number;
  duration: number;
  frequency: number;
  weightScalar: number;
};

export type SingleModelSimConfig = SimConfig & {
  directStimulation: DirectSimulationConfig[];
  synapses: null;
};

export type SynapseModelSimConfig = SimConfig & {
  synapses: SynapsesConfig;
};

export function isSingleModelSimConfig(
  config: SimConfig | SingleModelSimConfig
): config is SingleModelSimConfig {
  return !!config.directStimulation;
}

export function isSynapseModelSimConfig(config: SimConfig): config is SynapseModelSimConfig {
  return !!config.synapses;
}

export type StimulusConfig = {
  stimulusType: StimulusType;
  stimulusProtocol: StimulusModule | null;
  stimulusProtocolInfo: StimulusModuleDropdownOptionType | null;
  stimulusProtocolOptions: StimulusModuleDropdownOptionType[];
  paramInfo: StimulusParameter;
  paramValues: Record<string, number | null>;
  amplitudes: number[];
};

export type SimAction =
  | { type: 'CHANGE_STIMULATION_TYPE'; payload: { stimulationId: string; value: StimulusType } }
  | { type: 'CHANGE_PROTOCOL'; payload: { stimulationId: string; value: StimulusModule } }
  | {
      type: 'CHANGE_STIM_PARAM';
      payload: { stimulationId: string; key: keyof StimulusParameter; value: number | null };
    }
  | {
      type: 'CHANGE_DIRECT_STIM_PROPERTY';
      payload: { stimulationId: string; key: keyof DirectSimulationConfig; value: unknown };
    }
  | { type: 'CHANGE_AMPLITUDES'; payload: { stimulationId: string; value: number[] } }
  | { type: 'CHANGE_RECORD_FROM'; payload: string[] }
  | {
      type: 'UPDATE_SYNAPSE';
      payload: { id: string; key: keyof SynapseConfig; value: number };
    }
  | { type: 'SET_ONLY_STIMULUS'; payload: undefined }
  | { type: 'SET_ONLY_SYNAPSES'; payload: SynapsesConfig }
  | { type: 'SET_STIMULUS_AND_SYNAPSES'; payload: SynapsesConfig }
  | { type: 'ADD_SYNAPSE'; payload: SynapseConfig }
  | { type: 'REMOVE_SYNAPSE'; payload: { id: number } }
  | { type: 'ADD_STIMULATION_CONFIG'; payload: undefined }
  | { type: 'REMOVE_STIMULATION_CONFIG'; payload: { stimulationId: number } };

export interface SingleModelSimulationConfig {
  celsius: number;
  hypamp: number;
  vinit: number;
  injectTo: string;
  recordFrom: string[];
  stimulus: StimulusConfig;
}

export interface SingleNeuronSimulationPayload {
  config: SingleModelSimulationConfig;
  simulationResult: PlotData;
  stimuliPreviewData: PlotData;
}

export type SelectedSingleNeuronModel = {
  type: DataType;
  self: string;
  source: ExploreResource;
};

export type SelectedSynaptomModel = SelectedSingleNeuronModel & {
  source: MEModelSynaptome;
};

export type ModelResource = MEModelResource | SynaptomeModelResource;

export const isSynaptomModel = (model: ModelResource | null): model is SynaptomeModelResource => {
  console.log('Guard', model);
  if (!model) {
    return false;
  }

  const type = Array.isArray(model['@type']) ? model['@type'] : [model['@type']];
  console.log('Type', type);
  return type.includes(DataType.SingleNeuronSynaptome) && 'distribution' in model;
};

export type RunSimulationRequestBody = DirectSimulationConfig & { recordFrom: string[] };

export type ResponsePlotData = {
  t: number[];
  v: number[];
  name: string;
};

export type StimuliPlotRequest = {
  stimulusProtocol: StimulusModule;
  amplitudes: number[];
};

export type StimuliPlotResponse = {
  x: number[];
  y: number[];
  name: string;
};
