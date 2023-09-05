import find from 'lodash/find';
import merge from 'lodash/merge';

/**
 *
 * @param array source array to update
 * @param keyfn function to chcek if the the elemet existed or not
 * @param newVal the replacement value
 * @returns the updated array
 */
const updateArray = <T>({
  array,
  keyfn,
  newVal,
}: {
  array?: T[];
  keyfn: (item: T, index: number) => boolean;
  newVal: T;
}) => {
  if (array) {
    const match = find(array, keyfn);
    if (match) merge(match, newVal);
    return array;
  }
  return [];
};

export default updateArray;
