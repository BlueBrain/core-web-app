import { TypeDef, assertType } from '@/util/type-guards';

export interface VirtualLab {
  id: string;
  name: string;
  description: string;
  referenceEMail: string;
  members: VirtualLabMember[];
  plan?: VirtualLabPlanType;
  billing: {
    organization: string;
    firstname: string;
    lastname: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export enum VirtualLabPlanType {
  entry = 'entry',
  beginner = 'beginner',
  intermediate = 'intermediate',
  advanced = 'advanced',
}

const VirtualLabMemberTypeDef: TypeDef = {
  name: 'string',
  email: 'string',
  role: ['literal', 'admin', 'user'],
};

export interface VirtualLabMember {
  name: string;
  email: string;
  role: 'admin' | 'user';
  lastActive?: number;
}

export type NewMember = Pick<VirtualLabMember, 'email' | 'role'>;

export interface ComputeTime {
  labId: string;
  usedTimeInHours: number;
  totalTimeInHours: number;
}

const VirtualLabTypeDef: TypeDef = {
  id: 'string',
  name: 'string',
  description: 'string',
  referenceEMail: 'string',
  members: ['array', VirtualLabMemberTypeDef],
  plan: ['?', 'string'],
  billing: {
    firstname: 'string',
    lastname: 'string',
    address: 'string',
    city: 'string',
    postalCode: 'string',
    country: 'string',
  },
};

export function assertVirtualLabArray(data: unknown): asserts data is VirtualLab[] {
  assertType(data, ['array', VirtualLabTypeDef]);
}
