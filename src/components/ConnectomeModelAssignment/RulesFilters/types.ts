import { SynapticAssignmentRule } from '@/types/connectome-model-assignment';

export interface FilterItemType {
  ruleField: keyof SynapticAssignmentRule;
  value: string;
}
