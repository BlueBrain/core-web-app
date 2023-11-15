import { VirtualLab } from '@/services/virtual-lab/types';

export const createMockVirtualLab = (id: string, extra?: Partial<VirtualLab>): VirtualLab => ({
  id,
  name: `Mock Lab ${id}`,
  decription: 'Sploosh',
  referenceEMail: 'sterling.archer@secretservice.cc',
  members: [
    { name: 'Sterling Archer', email: 'sterling.archer@secretservice.cc', role: 'user' },
    { name: 'Malory Archer', email: 'malory.archer@secretservice.cc', role: 'admin' },
    { name: 'Algernop Krieger', email: 'drkrieger@secretservice.cc', role: 'admin' },
  ],
  plan: 'beginner',
  billing: {
    firstname: 'Malory',
    lastname: 'Archer',
    address: '456 Popeyes Suds and Duds',
    city: 'New York City',
    postalCode: '456',
    country: 'Worldwide',
  },
  ...extra,
});
