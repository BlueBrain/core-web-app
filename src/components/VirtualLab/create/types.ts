import { VirtualLab } from '@/types/virtual-lab/lab';
import { KeysOfType } from '@/util/typing';

export type VirtualLabWithOptionalId = Omit<VirtualLab, 'id'> & { id?: string };

export type VirtualLabStringKeys = KeysOfType<VirtualLabWithOptionalId, string>;
export interface VirtualLabPlanDefinition {
  id: number;
  name: string;
  features: Record<string, string[]>;
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
