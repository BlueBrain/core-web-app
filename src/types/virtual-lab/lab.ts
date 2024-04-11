import { VirtualLabMember } from './members';

export type VirtualLab = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  reference_email: string;
  budget: number;
  plan_id: number;
};

export enum VirtualLabPlanType {
  entry = 'entry',
  beginner = 'beginner',
  intermediate = 'intermediate',
  advanced = 'advanced',
}

export type NewMember = Pick<VirtualLabMember, 'email' | 'role'>;

export type MockBilling = {
  organization: string;
  firstname: string;
  lastname: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};
