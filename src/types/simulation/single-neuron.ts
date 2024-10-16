import { ExploreResource, MEModelSynaptome } from '../explore-section/es';
import { SynaptomeModelResource } from '../explore-section/delta-model';
import { MEModelResource } from '../me-model';
import { DataType } from '@/constants/explore-section/list-views';
import { PlotData } from '@/services/bluenaas-single-cell/types';

export enum SimulationTypeNames {
  SYNAPTOME_SIMULATION = 'synaptome-simulation',
  SINGLE_NEURON_SIMULATION = 'single-neuron-simulation',
}

export type StimulusType = 'current_clamp' | 'voltage_clamp' | 'conductance';
export type StimulusModule = 'ap_waveform' | 'idrest' | 'iv' | 'fire_pattern';

export type StimulusTypeOption = {
  label: string;
  value: StimulusType;
};

export type FunctionParameterNumber = {
  defaultValue: number;
  min: number;
  max: number;
  step: number;
  unit: string;
};

export type StimulusParameter = Record<'params', FunctionParameterNumber>;

export type ConditionalStimulusParamsTypes = Record<StimulusModule, StimulusParameter>;

export type StimulusDropdownInfo = {
  name: string;
  value: string;
};

export type SynaptomeConfig = SynapseConfig[];
export interface CurrentInjectionSimulationConfig {
  id: number;
  configId: string;
  injectTo: string;
  stimulus: StimulusConfig;
}

export type SimulationExperimentalSetup = {
  celsius: number;
  vinit: number;
  hypamp: number;
  maxTime: number;
  timeStep: number;
  seed: number;
};

export type RecordLocation = {
  section: string;
  offset: number;
};

export interface SimulationConfiguration {
  recordFrom: RecordLocation[];
  currentInjection: CurrentInjectionSimulationConfig[];
  conditions: SimulationExperimentalSetup;
  synapses?: SynaptomeConfig;
}

export type SynapseConfig = {
  id: string;
  configId: string;
  delay: number;
  duration: number;
  frequency: number | number[];
  weightScalar: number;
  color: string;
};

export type SingleModelSimConfig = SimulationConfiguration & {
  directStimulation: CurrentInjectionSimulationConfig[];
  synapses: null;
};

export type SynapseModelSimConfig = SimulationConfiguration & {
  synapses: SynaptomeConfig;
};

export type StimulusConfig = {
  stimulusType: StimulusType;
  stimulusProtocol: StimulusModule | null;
  amplitudes: number[] | number;
};

export interface SingleNeuronModelSimulationConfig {
  recordFrom: RecordLocation[];
  conditions: SimulationExperimentalSetup;
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
  newValue: number | string | number[] | null;
};

export type UpdateSynapseSimulationProperties = {
  id: number;
  entries: Array<{
    key: keyof SynapseConfig;
    newValue: number | string | null | number[];
  }>;
};

export type ProtocolDetails = {
  description: string;
  name: StimulusModule;
  label: string;
  usedBy: StimulusType[];

  defaults: {
    time: {
      delay: number;
      duration: number;
      stopTime: number;
    };

    current: {
      value: number;
      min: number;
      max: number;
      step: number;
    };
  };
};

type BluenaasError = {
  details: string;
  message: string;
  error_code: string;
};

type StreamSimulationEvent = 'init' | 'info' | 'data' | 'error';
type StreamSimulationStatus = 'pending' | 'started' | 'success' | 'failure';

type SimulationSteamData = {
  label: string;
  amplitude: number;
  frequency: number;
  recording: string;
  varying_key: string;
  varying_type: string;
  varying_order: number;
  t: Array<number>;
  v: Array<number>;
};

export type StreamSimulationResponse = {
  task_id: string;
  description: string;
  event: StreamSimulationEvent;
  state: StreamSimulationStatus;
  data: SimulationSteamData;
};

export const isBluenaasError = (obj: Object): obj is BluenaasError => {
  return 'details' in obj && 'message' in obj && 'error_code' in obj;
};

export const isBluenaasSimulationError = (obj: StreamSimulationResponse) => obj.event === 'error';
