import { Dispatch, SetStateAction } from 'react';
import { CheckboxOption, CheckListFilter, Filter, OptionsData } from './types';

/**
 * Returns an event handler.
 */
export function getCheckedChangeHandler(
  filters: Filter[],
  setFilters: Dispatch<SetStateAction<Filter[]>>,
  filter: Filter
) {
  return (key: string) => {
    const filterIndex = filters.findIndex((f) => f.field === filter.field);
    const otherCheckedOptions = (filters[filterIndex] as CheckListFilter).value;
    const existingIndex = otherCheckedOptions.findIndex((optionKey: string) => optionKey === key);

    setFilters([
      ...filters.slice(0, filterIndex),
      {
        ...filter,
        field: filter.field,
        title: filter.title,
        type: 'checkList',
        value:
          existingIndex === -1
            ? [...otherCheckedOptions, key]
            : [
                ...otherCheckedOptions.slice(0, existingIndex),
                ...otherCheckedOptions.slice(existingIndex + 1),
              ],
      },
      ...filters.slice(filterIndex + 1),
    ]);
  };
}

/**
 * Returns a useEffect callback.
 * This side effect will be triggered whenever the FiltersAtom updates.
 */
export function getFillOptionsEffect(
  field: string,
  data: OptionsData,
  filters: Filter[],
  setOptions: Dispatch<SetStateAction<CheckboxOption[]>>
) {
  return () => {
    const agg = data[field];
    const buckets = agg?.buckets ?? agg?.excludeOwnFilter?.buckets;

    const selectedOptions = (
      filters.find(
        ({ field: itemField }: { field: string }) => itemField === field
      ) as CheckListFilter
    )?.value;

    return buckets
      ? setOptions(
          buckets?.map(({ key, doc_count: count }) => {
            const existingIndex = selectedOptions?.findIndex(
              (selectedKey: string) => selectedKey === key
            );

            return {
              checked: existingIndex !== -1,
              count,
              key,
            } as CheckboxOption;
          })
        )
      : undefined;
  };
}

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
