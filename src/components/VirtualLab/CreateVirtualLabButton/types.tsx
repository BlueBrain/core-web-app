import { VirtualLab } from '@/types/virtual-lab/lab';

export type Step = 'Information' | 'Plans';

export type VirtualLabWithOptionalId = Omit<VirtualLab, 'id'> & { id?: string };
