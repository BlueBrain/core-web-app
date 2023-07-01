/* eslint-disable no-restricted-syntax */
import { useMemo } from 'react';
import { SynapticAssignementRule } from '../types';
import { useSynapticAssignementRules } from './synaptic-assignement-rules';

/**
 * Return a function that provides all the possible values
 * for a given field.
 *
 * WARNING!
 * For now, we deduce the possible values from those that already
 * exist in the rules we get.
 */
export function useGetFieldsOptions(): (field: string) => string[] {
  const rules = useSynapticAssignementRules(false);
  return useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const rule of rules) {
      for (const field of Object.keys(rule)) {
        if (!map.has(field)) map.set(field, new Set());
        const value = rule[field as keyof SynapticAssignementRule];
        const set = map.get(field);
        if (set) set.add(value ?? '');
      }
    }
    const arrays = new Map<string, string[]>();
    for (const field of Array.from(map.keys())) {
      const arr = Array.from(map.get(field) ?? []).sort();
      arrays.set(field, arr);
    }
    return (field: string) => {
      const arr = arrays.get(field);
      return arr ?? [];
    };
  }, [rules]);
}
