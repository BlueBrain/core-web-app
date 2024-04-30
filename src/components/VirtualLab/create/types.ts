import { VirtualLab } from '@/types/virtual-lab/lab';

export type VirtualLabWithOptionalId = Omit<VirtualLab, 'id'> & { id?: string };

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
