import { VlmResponse } from './common';
import { VirtualLabMember } from './members';
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
}
export interface VirtualLabPlanDefinition {
  id: number;
  name: string;
  features: Record<string, string[]>;
  price: number;
}
