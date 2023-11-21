import { VirtualLab, VirtualLabPlanType } from '@/services/virtual-lab/types';
import { KeysOfType } from '@/util/typing';

export type VirtualLabWithOptionalId = Omit<VirtualLab, 'id'> & { id?: string };

export type VirtualLabStringKeys = KeysOfType<VirtualLabWithOptionalId, string>;

export interface VirtualLabPlanDefinition {
  type: VirtualLabPlanType;
  title: string;
  advantages: string[];
  price: number;
}

export interface FieldType {
  label: string;
  placeholder: string;
  /** Default to `text` */
  type?: 'text' | 'email';
  required?: boolean;
  title?: string;
  pattern?: string;
  options?: string[] | Record<string, string>;
}
