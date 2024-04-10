import { VlmResponse } from './common';
import { VirtualLabMember } from './members';

export type VirtualLab = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  reference_email: string;
  budget: number;
  plan_id: number;
  users: VirtualLabMember[];
};

export type VirtualLabResponse = VlmResponse<{ virtual_lab: VirtualLab }>;

export enum VirtualLabPlanType {
  entry = 'entry',
  beginner = 'beginner',
  intermediate = 'intermediate',
  advanced = 'advanced',
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
  ionChannel = 'ion-channel',
  singleNeuron = 'single-neuron',
  pairedNeuron = 'paired-neuron',
  synaptome = 'synaptome',
}
