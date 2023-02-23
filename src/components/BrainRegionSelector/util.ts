import { formatNumber } from '@/util/common';
import { CompositionUnit } from '@/types/composition';

/**
 * Calculates the metric to be displayed based on whether count or density is
 * currently selected
 */
export function getMetric(composition: CompositionUnit, densityOrCount: keyof CompositionUnit) {
  if (composition && densityOrCount === 'count') {
    return formatNumber(composition.count);
  }

  if (composition && densityOrCount === 'density') {
    return formatNumber(composition.density);
  }

  return null;
}
