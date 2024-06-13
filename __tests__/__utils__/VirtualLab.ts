import { VirtualLab } from '@/types/virtual-lab/lab';

export const createMockVirtualLab = (id: string, extra?: Partial<VirtualLab>): VirtualLab => ({
  id,
  name: `Mock Lab ${id}`,
  description: 'Sploosh',
  reference_email: 'sterling.archer@secretservice.cc',
  budget: 0,
  created_at: '',
  entity: 'Mock entity',
  plan_id: 0,
  ...extra,
});
