import find from 'lodash/find';
import merge from 'lodash/merge';

export { default as highlightHits } from './highlightHits';
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
