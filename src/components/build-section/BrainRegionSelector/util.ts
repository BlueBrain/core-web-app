import { formatNumber } from '@/util/common';
import { CalculatedCompositionPair } from '@/types/composition/calculation';

/**
 * Calculates the metric to be displayed based on whether count or density is
 * currently selected
 */
// eslint-disable-next-line import/prefer-default-export
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
