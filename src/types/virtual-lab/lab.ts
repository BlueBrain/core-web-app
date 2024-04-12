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
  Entry = 'entry',
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
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
