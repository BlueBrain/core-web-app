/* eslint-disable no-restricted-syntax */
import { formatNumber } from '@/util/common';
import { CalculatedCompositionPair } from '@/types/composition/calculation';
import { NavValue } from '@/state/brain-regions/types';

/**
 * Calculates the metric to be displayed based on whether count or density is
 * currently selected
 */
export function getMetric(
  composition: CalculatedCompositionPair,
  densityOrCount: 'density' | 'count'
) {
  if (composition && densityOrCount === 'count') {
    return formatNumber(composition.count);
  }

  if (composition && densityOrCount === 'density') {
    return formatNumber(composition.density);
  }

  return null;
}

/**
 *
 * @param input NavValue  object with nested object (ex: brain regions expanded nodes)
 * @returns result string[] all the deeply nested keys of the input
 */
export function getNestedKeysDeeply(input: NavValue, result: Array<string> = []) {
  if (input) {
    for (const [key, value] of Object.entries(input)) {
      result.push(key);
      if (value !== null && typeof value === 'object') return getNestedKeysDeeply(value, result);
    }
  }
  return result;
}
