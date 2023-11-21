import { assertType } from '@/util/type-guards';

export interface VirtualLab {
  id: string;
  name: string;
  description: string;
  referenceEMail: string;
  members: VirtualLabMember[];
  plan?: 'entry' | 'beginner' | 'intermediate' | 'advanced';
  billing: {
    firstname: string;
    lastname: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface VirtualLabMember {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface ComputeTime {
  labId: string;
  usedTimeInHours: number;
  totalTimeInHours: number;
}

export function assertVirtualLabArray(data: unknown): asserts data is VirtualLab[] {
  assertType(data, [
    'array',
    {
      id: 'string',
      name: 'string',
      description: 'string',
      referenceEMail: 'string',
      members: [
        'array',
        {
          name: 'string',
          email: 'string',
          role: 'string',
        },
      ],
      plan: ['?', 'string'],
      billing: {
        firstname: 'string',
        lastname: 'string',
        address: 'string',
        city: 'string',
        postalCode: 'string',
        country: 'string',
      },
    },
  ]);
}
