import find from 'lodash/find';
import merge from 'lodash/merge';

export { default as copyClipboard } from './copyClipboard';

export const updateAndMerge = <T>(
  array: Array<T>,
  keyfn: (item: T) => boolean,
  newVal: any
): Array<T> => {
  const match = find(array, keyfn);
  if (match) merge(match, newVal);
  return array;
};

export function isJSON(str: string) {
  try {
    return JSON.parse(str) && !!str;
  } catch (e) {
    return false;
  }
}
