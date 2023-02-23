import { Dispatch, SetStateAction } from 'react';
import { getOr, set } from 'lodash/fp';
import { NavValue } from '@/components/TreeNavItem';

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
