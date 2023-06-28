import { useCallback, useMemo, useReducer } from 'react';
import compose from 'lodash/fp/compose';
import { PartialRecord } from '@/types/common';

export type FilterType = 'all' | 'value' | 'range';

export type FilterValues = {
  checked: boolean;
  id: string;
  range: { max?: number; min?: number };
  type: FilterType | undefined; // undefined before selected
  value?: string;
};

export type FilterMethods = {
  toggleColumn: (key: string) => void;
  onRadioChange: (value: number, id: string) => void;
  onRangeChange: (type: 'max' | 'min', value?: number) => void;
  onValueChange: (value: string) => void;
};

type FiltersState = FilterValues[];

type FiltersAction = {
  type: 'filter-toggle' | 'filter-range-update' | 'filter-type-update' | 'filter-value-update';
  payload: PartialRecord<keyof FilterValues, any>; // TODO: Update ANY to be more specific.
};

/** Return a filter object from existing data and optional parameters. */
export function createFilterValues(config: PartialRecord<keyof FilterValues, any>) {
  const { checked, id, range, type, value } = config;

  return {
    checked: checked ?? false,
    id,
    range: range ?? { max: undefined, min: undefined },
    type,
    value: value ?? '',
  };
}

/** Returns a function that creates a new filter from an existing one, or from the default config. */
function createFilterFromExisting(filterConfig?: FilterValues) {
  return function getNewFilter(
    filterSpec: PartialRecord<keyof FilterValues, any> // TODO: Update ANY to be more specific.
  ) {
    return filterConfig ? { ...filterConfig, ...filterSpec } : createFilterValues(filterSpec);
  };
}

/** Returns a function that will create the new filter object */
function getNewFilterState(filters: FilterValues[], filter: FilterValues) {
  const existingFilterIndex = filters.findIndex(({ id }) => id === filter.id);

  return existingFilterIndex !== -1
    ? [...filters.slice(0, existingFilterIndex), filter, ...filters.slice(existingFilterIndex + 1)] // Update existing
    : [...filters, filter]; // Or add new
}

/** Returns a function that will create the new filter object */
function getFilterStateSetter(state: FilterValues[]) {
  return (newFilter: FilterValues) => getNewFilterState(state, newFilter);
}

function filterReducer(state: FiltersState, action: FiltersAction): FiltersState {
  const { type, payload } = action;
  const existingFilterValues = state.find(({ id }) => id === payload.id);

  const getNewFilter = createFilterFromExisting(existingFilterValues);
  const updateStateWithNewFilter = compose(getFilterStateSetter(state), getNewFilter);

  switch (type) {
    case 'filter-toggle': {
      return updateStateWithNewFilter({ checked: !existingFilterValues?.checked });
    }
    case 'filter-range-update': {
      return updateStateWithNewFilter({ range: payload.range });
    }
    case 'filter-type-update': {
      return updateStateWithNewFilter({ type: payload.type });
    }
    case 'filter-value-update': {
      return updateStateWithNewFilter({ value: payload.value });
    }
    default:
      return state;
  }
}

export default function useFilterList(defaultState: FiltersState) {
  const [state, dispatch] = useReducer(filterReducer, defaultState);

  const options = useMemo(() => ['all', 'value', 'range'] as FilterType[], []);

  function applyActiveFilters(columns: Record<any, number | number[] | string>) {
    const activeFilters = state.filter(({ checked, type }) => checked && type);

    const appliedFilters = activeFilters.map((cur: FilterValues) => {
      const columnValue = columns[cur.id];

      switch (cur.type) {
        case 'range': {
          const { max, min } = cur.range;

          return (
            columnValue &&
            (typeof min !== 'undefined' ? (columnValue as number) >= min : undefined) &&
            (typeof max !== 'undefined' ? (columnValue as number) <= max : undefined)
          );
        }
        case 'value': {
          const filterValue = cur.value;

          return filterValue && columnValue === Number(filterValue);
        }
        default:
          // undefined or "all"
          return true;
      }
    });

    return !appliedFilters.includes(false);
  }

  function checkForActiveFilters({ key }: { key: string }) {
    const matchInState = state.findIndex(
      ({ checked, id: idInState }) => idInState === key && checked === true
    );

    return matchInState > -1;
  }

  const findExistingFilterIndex = useCallback(
    (id: string) => state.findIndex(({ id: idInState }) => idInState === id),
    [state]
  );

  const getFilterValues = useCallback(
    (existingFilterIndex: number, id: string) =>
      existingFilterIndex !== -1 ? state[existingFilterIndex] : createFilterValues({ id }),
    [state]
  );

  const getFilterValuesFromId = useCallback(
    (id: string) =>
      compose(
        (index: number): FilterValues => getFilterValues(index, id),
        findExistingFilterIndex
      )(id),
    [findExistingFilterIndex, getFilterValues]
  );

  const getValues = useCallback((id: string) => getFilterValuesFromId(id), [getFilterValuesFromId]);

  const toggleColumn = useCallback(
    (key: string) => {
      const config = getFilterValuesFromId(key);

      return dispatch({ type: 'filter-toggle', payload: config });
    },
    [dispatch, getFilterValuesFromId]
  );

  const getOnRadioChange = useCallback(
    (id: string) => (radioValue: number) =>
      dispatch({
        type: 'filter-type-update',
        payload: { id, type: options[radioValue] },
      }),
    [dispatch, options]
  );

  const getOnRangeChange = useCallback(
    (id: string) => (rangeType: 'max' | 'min', rangeValue?: number) => {
      const { range } = getFilterValuesFromId(id);

      const newRange = { ...range, [rangeType]: rangeValue };

      return dispatch({
        type: 'filter-range-update',
        payload: { id, range: newRange },
      });
    },
    [dispatch, getFilterValuesFromId]
  );

  const getOnValueChange = useCallback(
    (id: string) => (inputValue: string) =>
      dispatch({
        type: 'filter-value-update',
        payload: { id, value: inputValue },
      }),
    [dispatch]
  );

  const getMethods = useCallback(
    (id: string): FilterMethods => ({
      toggleColumn,
      onRadioChange: getOnRadioChange(id),
      onRangeChange: getOnRangeChange(id),
      onValueChange: getOnValueChange(id),
    }),
    [getOnRadioChange, getOnRangeChange, getOnValueChange, toggleColumn]
  );

  return {
    applyActiveFilters,
    checkForActiveFilters,
    getMethods,
    getValues,
    options,
  };
}
