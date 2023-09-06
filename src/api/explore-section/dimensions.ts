import range from 'lodash/range';
import { DimensionRange, DimensionValue } from '@/components/explore-section/Simulations/types';

/**
 * Calculates the dimension values based on whether they are given manually or as a range
 * Returns an array of the dimension values
 *
 * @param dimensionValue
 */
export default function calculateDimensionValues(
  dimensionValue: DimensionValue | DimensionRange
): number[] {
  if (dimensionValue.type === 'value' && dimensionValue.value) {
    return dimensionValue.value.split(',').map((i: string) => Number(i));
  }
  if (dimensionValue.type === 'range' && dimensionValue.minValue && dimensionValue.maxValue) {
    const minValue = parseFloat(dimensionValue.minValue);
    const maxValue = parseFloat(dimensionValue.maxValue);
    const step = parseFloat(dimensionValue.step);
    // applying toFixed() due to a rounding error from range https://github.com/lodash/lodash/issues/1539
    return range(minValue, maxValue, step).map((num) => parseFloat(num.toFixed(2)));
  }
  return [];
}
