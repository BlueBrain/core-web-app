import { SynapticAssignementRule } from '@/components/SynapticAssignementRulesTable/types';

export interface FilterItemType {
  ruleField: keyof SynapticAssignementRule;
  value: string;
}
