import { ExploreResource, MEModelSynaptome } from '../explore-section/es';
import { SynaptomeModelResource } from '../explore-section/delta-model';
import { MEModelResource } from '../me-model';
import { DataType } from '@/constants/explore-section/list-views';
import { PlotData } from '@/services/bluenaas-single-cell/types';

export type StimulusType = 'current_clamp' | 'voltage_clamp' | 'conductance';
export type StimulusModule = 'ap_waveform' | 'idrest' | 'iv' | 'fire_pattern';

export type StimulusTypeOption = {
  label: string;
  value: StimulusType;
};

export type StimulusModuleOption = {
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
export interface CurrentInjectionSimulationConfig {
  id: number;
  configId: string;
  injectTo: string;
  stimulus: StimulusConfig;
}

export type SimulationConditions = {
  celsius: number;
  vinit: number;
  hypamp: number;
  max_time: number;
  time_step: number;
  seed: number;
};

export type RecordLocation = {
  section: string;
  offset: number;
};

export interface SimulationConfiguration {
  recordFrom: RecordLocation[];
  currentInjection: CurrentInjectionSimulationConfig[];
  conditions: SimulationConditions;
  synapses?: SynapsesConfig;
}

export type SynapseConfig = {
  key: number;
  id: string;
  delay: number;
  duration: number;
  frequency: number;
  weightScalar: number;
};

export type SingleModelSimConfig = SimulationConfiguration & {
  directStimulation: CurrentInjectionSimulationConfig[];
  synapses: null;
};

export type SynapseModelSimConfig = SimulationConfiguration & {
  synapses: SynapsesConfig;
};

export type StimulusConfig = {
  stimulusType: StimulusType;
  stimulusProtocol: StimulusModule | null;
  stimulusProtocolInfo: StimulusModuleOption | null;
  stimulusProtocolOptions: StimulusModuleOption[];
  paramInfo: StimulusParameter;
  paramValues: Record<string, number | null>;
  amplitudes: number[];
};

export interface SingleNeuronModelSimulationConfig {
  recordFrom: RecordLocation[];
  conditions: SimulationConditions;
  currentInjection: CurrentInjectionSimulationConfig;
  synaptome?: Array<SynapseConfig>;
}

export interface SimulationPayload {
  config: SingleNeuronModelSimulationConfig;
  simulation: Record<string, PlotData>;
  stimulus: PlotData | null;
}

export type SelectedSingleNeuronModel = {
  type: DataType;
  self: string;
  source: ExploreResource;
};

export type SelectedSynaptomeModel = SelectedSingleNeuronModel & {
  source: MEModelSynaptome;
};

export type ModelResource = MEModelResource | SynaptomeModelResource;

export const isSynaptomModel = (model: ModelResource | null): model is SynaptomeModelResource => {
  if (!model) {
    return false;
  }

  const type = Array.isArray(model['@type']) ? model['@type'] : [model['@type']];
  return type.includes(DataType.SingleNeuronSynaptome) && 'distribution' in model;
};

export type UpdateSynapseSimulationProperty = {
  id: number;
  key: keyof SynapseConfig;
  newValue: number;
};
