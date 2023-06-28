import { Filter } from './types';

/**
 * Checks whether the filter has a value assigned
 *
 * @param filter the filter to check
 */
export function filterHasValue(filter: Filter) {
  switch (filter.type) {
    case 'checkList':
      return filter.value.length !== 0;
    case 'dateRange':
      return filter.value.gte || filter.value.lte;
    case 'valueRange':
      return filter.value.gte || filter.value.lte;
    default:
      return !!filter.value;
  }
}
