import { TypeDef, assertType } from '@/util/type-guards';

export type VirtualLabPlanType = 'entry' | 'beginner' | 'intermediate' | 'advanced';

export interface VirtualLabMember {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

const VirtualLabMemberTypeDef: TypeDef = {
  name: 'string',
  email: 'string',
  role: ['literal', 'admin', 'user'],
};

export interface VirtualLab {
  id: string;
  name: string;
  description: string;
  referenceEMail: string;
  members: VirtualLabMember[];
  plan?: VirtualLabPlanType;
  billing: {
    firstname: string;
    lastname: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
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

export interface ComputeTime {
  labId: string;
  usedTimeInHours: number;
  totalTimeInHours: number;
}
