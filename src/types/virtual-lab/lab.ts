import { VlmResponse } from './common';
import { VirtualLabMember } from './members';
import { DataType } from '@/constants/explore-section/list-views';
import { DateISOString } from '@/types/nexus';

export type VirtualLab = {
  id: string;
  name: string;
  description: string;
  entity: string;
  created_at: DateISOString;
  reference_email: string;
  budget: number;
  plan_id: number;
  include_members?: VirtualLabMember[];
};

export type VirtualLabResponse = VlmResponse<{ virtual_lab: VirtualLab }>;

export enum VirtualLabPlanType {
  Entry = 'Cellular lab',
  Beginner = 'Circuit lab',
  Intermediate = 'System lab',
}

export type MockBilling = {
  organization: string;
  firstname: string;
  lastname: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

export enum SimulationType {
  IonChannel = 'ion-channel',
  SingleNeuron = 'single-neuron',
  PairedNeuron = 'paired-neuron',
  Synaptome = 'synaptome',
  Microcircuit = 'microcircuit',
  NeuroGliaVasculature = 'neuro-glia-vasculature',
  BrainRegions = 'brain-regions',
  BrainSystems = 'brain-systems',
  WholeBrain = 'whole-brain',
}

// maps each simulation scope to a data type
export const SimulationScopeToDataType = {
  [SimulationType.SingleNeuron]: DataType.SingleNeuronSimulation,
  [SimulationType.IonChannel]: null,
  [SimulationType.PairedNeuron]: null,
  [SimulationType.Synaptome]: DataType.SingleNeuronSynaptomeSimulation,
  [SimulationType.Microcircuit]: null,
  [SimulationType.NeuroGliaVasculature]: null,
  [SimulationType.BrainRegions]: null,
  [SimulationType.BrainSystems]: null,
  [SimulationType.WholeBrain]: null,
};

// Nexus resource `@type` that should be shown in project -> build tab.
export const SimulationScopeToModelType = {
  [SimulationType.SingleNeuron]: DataType.CircuitMEModel,
  [SimulationType.Synaptome]: DataType.SingleNeuronSynaptome,
  [SimulationType.IonChannel]: null,
  [SimulationType.PairedNeuron]: null,
  [SimulationType.Microcircuit]: null,
  [SimulationType.NeuroGliaVasculature]: null,
  [SimulationType.BrainRegions]: null,
  [SimulationType.BrainSystems]: null,
  [SimulationType.WholeBrain]: null,
};

export interface VirtualLabPlanDefinition {
  id: number;
  name: string;
  features: Record<string, string[]>;
  price: number;
}
