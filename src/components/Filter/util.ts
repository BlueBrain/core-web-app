import { Dispatch, SetStateAction } from 'react';
import { CheckboxOption, CheckListFilter, Filter, OptionsData } from './types';

/**
 * Transforms an ElasticSearch aggregation into an array of CheckList options.
 * @param {OptionsData} data - The aggregations object whose buckets will be used as CheckList options.
 * @param {CheckListFilter} filter - The filter object that contains any previously selected options.
 */
export function createOptionsFromBuckets(
  data: OptionsData,
  { value: selectedOptions }: CheckListFilter
) {
  const defaultBuckets = data?.buckets;
  const withOtherFilters = data?.excludeOwnFilter?.buckets;
  const buckets = withOtherFilters?.length ? withOtherFilters : defaultBuckets;

  return buckets?.map(
    ({
      key,
      key_as_string: keyAsString,
      doc_count: count,
    }: {
      key: string;
      key_as_string: string;
      doc_count: number;
    }) => {
      const existingIndex = selectedOptions.findIndex((selectedKey) => selectedKey === key);

      return {
        checked: existingIndex !== -1,
        count,
        key,
        keyAsString,
      };
    }
  ) as CheckboxOption[];
}

/**
 * Higher-Order Function: Returns an event handler.
 * @param {Filter[]} filters - The FiltersAtom.
 * @param {Dispatch<SetStateAction<Filter[]>>} setFilters - Sets the FiltersAtom.
 * @param {string} field - Ex. "createdBy", "eType", etc.
 */
export function getCheckedChangeHandler(
  filters: Filter[],
  setFilters: Dispatch<SetStateAction<Filter[]>>,
  field: string
) {
  return (key: string) => {
    const filterIndex = filters.findIndex((filter) => filter.field === field);
    const otherCheckedOptions = (filters[filterIndex] as CheckListFilter).value;
    const existingIndex = otherCheckedOptions.findIndex((optionKey: string) => optionKey === key);

    setFilters([
      ...filters.slice(0, filterIndex),
      {
        field,
        type: 'checkList',
        value:
          existingIndex !== -1
            ? [
                ...otherCheckedOptions.slice(0, existingIndex),
                ...otherCheckedOptions.slice(existingIndex + 1),
              ]
            : [...otherCheckedOptions, key],
      },
      ...filters.slice(filterIndex + 1),
    ]);
  };
}

/**
 * Higher-Order Function: Returns a useEffect callback. This side effect will be triggered whenever the FiltersAtom updates.
 * @param {string} field - Ex. "createdBy", "eType", etc.
 */
export function getFillOptionsEffect(field: string) {
  return (
    data: OptionsData,
    filters: Filter[],
    setOptions: Dispatch<SetStateAction<CheckboxOption[]>>
  ) => {
    const optionsFromBuckets = createOptionsFromBuckets(
      data,
      filters.find(
        ({ field: itemField }: { field: string }) => itemField === field
      ) as CheckListFilter
    );

    if (optionsFromBuckets) {
      setOptions(optionsFromBuckets);
    }
  };
}
