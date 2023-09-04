import { Dispatch, ReactNode, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Loadable } from 'jotai/vanilla/utils/loadable';
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { loadable } from 'jotai/utils';
import { useAtom, useAtomValue } from 'jotai';
import { Aggregations, NestedStatsAggregation, Statistics } from '@/types/explore-section/fields';
import {
  Filter,
  GteLteValue,
  OptionsData,
  ValueOrRangeFilter,
  RangeFilter,
} from '@/components/Filter/types';
import {
  CheckList,
  DateRange,
  FilterGroup,
  FilterGroupProps,
  defaultList,
  listWithInference,
} from '@/components/Filter';
import ValueRange from '@/components/Filter/ValueRange';
import ValueOrRange from '@/components/Filter/ValueOrRange';
import { FilterValues } from '@/types/explore-section/application';
import EXPLORE_FIELDS_CONFIG from '@/constants/explore-section/explore-fields-config';
import {
  activeColumnsAtom,
  aggregationsAtom,
  filtersAtom,
} from '@/state/explore-section/list-view-atoms';

export type ControlPanelProps = {
  children?: ReactNode;
  toggleDisplay: () => void;
  experimentTypeName: string;
};

function createFilterItemComponent(
  filter: Filter,
  aggregations: Loadable<Aggregations | undefined>,
  filterValues: FilterValues,
  setFilterValues: Dispatch<SetStateAction<FilterValues>>
) {
  return function FilterItemComponent() {
    const { type } = filter;
    const { nestedField } = EXPLORE_FIELDS_CONFIG[filter.field];

    let agg;

    if (aggregations.state === 'loading') {
      return (
        <div className="flex items-center justify-center">
          <Spin indicator={<LoadingOutlined />} />
        </div>
      );
    }

    const updateFilterValues = (field: string, values: Filter['value']) => {
      setFilterValues((prevState) => ({
        ...prevState,
        [field]: values,
      }));
    };

    if (aggregations.state !== 'hasData' || !aggregations?.data) return null;

    switch (type) {
      case 'dateRange':
        return (
          <DateRange
            filter={filter as RangeFilter}
            onChange={(values: GteLteValue) => updateFilterValues(filter.field, values)}
          />
        );

      case 'valueRange':
        if (nestedField) {
          const nestedAgg = aggregations.data[filter.field] as NestedStatsAggregation;
          agg = nestedAgg[filter.field][nestedField.field] as Statistics;
        } else {
          agg = aggregations.data[filter.field] as Statistics;
        }

        return (
          <ValueRange
            filter={filter as RangeFilter}
            aggregation={agg}
            onChange={(values: GteLteValue) => updateFilterValues(filter.field, values)}
          />
        );
      case 'checkListInference':
        return (
          <CheckList
            data={aggregations.data as OptionsData}
            filter={filter}
            values={filterValues[filter.field] as string[]}
            onChange={(values: string[]) => updateFilterValues(filter.field, values)}
          >
            {listWithInference}
          </CheckList>
        );
      case 'checkList':
        return (
          <CheckList
            data={aggregations.data as OptionsData}
            filter={filter}
            values={filterValues[filter.field] as string[]}
            onChange={(values: string[]) => updateFilterValues(filter.field, values)}
          >
            {defaultList}
          </CheckList>
        );

      case 'valueOrRange':
        return (
          <ValueOrRange
            filter={filter as ValueOrRangeFilter}
            setFilter={(value: ValueOrRangeFilter['value']) =>
              updateFilterValues(filter.field, value)
            }
          />
        );

      default:
        return null;
    }
  };
}

export default function ControlPanel({
  children,
  toggleDisplay,
  experimentTypeName,
}: ControlPanelProps) {
  const [activeColumns, setActiveColumns] = useAtom(activeColumnsAtom(experimentTypeName));

  const aggregationsLoadable = useMemo(
    () => loadable(aggregationsAtom(experimentTypeName)),
    [experimentTypeName]
  );

  const aggregations = useAtomValue(aggregationsLoadable);
  const [filters, setFilters] = useAtom(filtersAtom(experimentTypeName));

  const [filterValues, setFilterValues] = useState<FilterValues>({});

  const onToggleActive = (key: string) => {
    const existingIndex = activeColumns.findIndex((existingKey) => existingKey === key);

    return existingIndex === -1
      ? setActiveColumns([...activeColumns, key])
      : setActiveColumns([
          ...activeColumns.slice(0, existingIndex),
          ...activeColumns.slice(existingIndex + 1),
        ]);
  };

  useEffect(() => {
    const values: FilterValues = {};
    filters.forEach((filter: Filter) => {
      values[filter.field as string] = filter.value;
    });

    setFilterValues(values);
  }, [filters]);

  const submitValues = () => {
    setFilters(
      filters.map((fil: Filter) => ({ ...fil, value: filterValues[fil.field] } as Filter))
    );
  };

  const activeColumnsLength = activeColumns.length ? activeColumns.length - 1 : 0;
  const activeColumnsText = `${activeColumnsLength} active ${
    activeColumnsLength === 1 ? 'column' : 'columns'
  }`;

  const filterItems = filters.map((filter) => ({
    content:
      filter.type && createFilterItemComponent(filter, aggregations, filterValues, setFilterValues),
    display: activeColumns.includes(filter.field),
    label: EXPLORE_FIELDS_CONFIG[filter.field].title,
    type: filter.type,
    toggleFunc: () => onToggleActive && onToggleActive(filter.field),
  })) as FilterGroupProps['items'];

  return (
    <div className="bg-primary-9 flex flex-col h-screen overflow-y-scroll pl-8 pr-16 py-6 shrink-0 space-y-4 w-[480px]">
      <button type="button" onClick={toggleDisplay} className="text-white text-right">
        <CloseOutlined />
      </button>
      <span className="flex font-bold gap-2 items-baseline text-2xl text-white">
        Filters
        <small className="font-light text-base text-primary-3">{activeColumnsText}</small>
      </span>

      <p className="text-white">
        Sed risus pretium quam vulputate dignissim. Sollicitudin aliquam ultrices sagittis orci a
        scelerisque.
      </p>

      <div className="flex flex-col gap-12">
        <FilterGroup items={filterItems} filters={filters} setFilters={setFilters} />
        {children}
      </div>
      <div className="w-full">
        <button
          type="submit"
          onClick={submitValues}
          className="mt-4 float-right bg-primary-2 py-3 px-8 text-primary-9"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
