import { VirtualLabWithOptionalId } from './types';

export const EMPTY_VIRTUAL_LAB: VirtualLabWithOptionalId = {
  created_at: '',
  entity: '',
  name: '',
  description: '',
  reference_email: '',
  budget: 1,
  plan_id: 1,
  include_members: [],
};
