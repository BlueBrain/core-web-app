import { VirtualLab } from '@/types/virtual-lab/lab';
import { Role } from '@/types/virtual-lab/members';

export type Step = 'Information' | 'Plans' | 'Members';

export type VirtualLabCreationMember = {
  email: string;
  role: Role;
};

export type VirtualLabWithOptionalId = Omit<VirtualLab, 'id' | 'include_members'> & {
  id?: string;
  include_members?: VirtualLabCreationMember[];
};
