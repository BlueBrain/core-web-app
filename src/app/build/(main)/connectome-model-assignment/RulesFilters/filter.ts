/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import { FilterItemType } from './types';
import { SynapticAssignementRule } from '@/components/SynapticAssignementRulesTable/types';

export default class Filter {
  constructor(private readonly filterItems: FilterItemType[]) {}

  public readonly exec = (rule: SynapticAssignementRule) => {
    for (const { ruleField, value } of this.filterItems) {
      const subStringToFind = value.trim().toLowerCase();
      if (subStringToFind.length === 0) continue;

      const ruleValue = rule[ruleField];
      if (typeof ruleValue !== 'string') continue;

      if (!ruleValue.toLocaleLowerCase().includes(subStringToFind)) return false;
    }
    return true;
  };
}
