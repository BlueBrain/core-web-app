import { Dispatch, SetStateAction } from 'react';
import { getOr, set } from 'lodash/fp';
import { NavValue } from '@/components/TreeNavItem';
import { formatNumber } from '@/util/common';
import { CompositionUnit } from '@/types/atlas';

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

export function handleNavValueChange(
  navValue: NavValue,
  setNavValue: Dispatch<SetStateAction<NavValue>>
) {
  return (newValue: string[], path: string[]) => {
    const nestedValue = newValue.length
      ? newValue.reduce(
          (acc, cur) => ({ ...acc, [cur]: getOr(null, [...path, cur], navValue) }),
          {}
        )
      : null;

    const newNavVal = path.length ? set(path, nestedValue, navValue as {}) : nestedValue;

    return setNavValue(newNavVal);
  };
}
