import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { Loadable } from 'jotai/vanilla/utils/loadable';
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { Aggregations, NestedStatsAggregation, Statistics } from '@/types/explore-section/fields';
import { Filter, OptionsData, RangeFilter } from '@/components/Filter/types';
import { CheckList, DateRange, FilterGroup, FilterGroupProps } from '@/components/Filter';
import ValueRange from '@/components/Filter/ValueRange';
import { FilterValues } from '@/types/explore-section/application';
import LISTING_CONFIG from '@/constants/explore-section/es-terms-render';

type FiltersProps = {
  aggregations: Loadable<Aggregations>;
  filters: Filter[];
  setFilters: Dispatch<SetStateAction<Filter[]>>;
  filterValues: FilterValues;
  setFilterValues: Dispatch<SetStateAction<FilterValues>>;
};

type ControlPanelProps = {
  aggregations: Loadable<any>;
  children?: ReactNode;
  filters: Filter[];
  setOpen: Dispatch<SetStateAction<boolean>>;
  setFilters: Dispatch<SetStateAction<Filter[]>>;
};

function CheckListWrapper({
  aggregations,
  filter,
  setFilterValues,
  values,
}: {
  aggregations: Loadable<Aggregations>;
  filter: Filter;
  values: string[];
  setFilterValues: Dispatch<SetStateAction<FilterValues>>;
}) {
  return (
    <CheckList
      data={
        (aggregations.state === 'hasData' && aggregations.data
          ? aggregations.data
          : []) as OptionsData
      }
      filter={filter}
      values={values}
      setFilterValues={setFilterValues}
    />
  );
}

function createFilterItemComponent(
  filter: Filter,
  aggregations: Loadable<Aggregations>,
  filterValues: FilterValues,
  setFilterValues: Dispatch<SetStateAction<FilterValues>>
) {
  return function FilterItemComponent() {
    const { type } = filter;
    const { nestedField } = LISTING_CONFIG[filter.field];
    let agg;
    if (aggregations.state === 'loading') {
      return (
        <div className="flex items-center justify-center">
          <Spin indicator={<LoadingOutlined />} />
        </div>
      );
    }
    if (aggregations.state === 'hasData' && aggregations.data) {
      switch (type) {
        case 'dateRange':
          return <DateRange filter={filter as RangeFilter} setFilterValues={setFilterValues} />;
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
              setFilterValues={setFilterValues}
            />
          );
        case 'checkList':
          return (
            <CheckListWrapper
              aggregations={aggregations}
              filter={filter}
              setFilterValues={setFilterValues}
              values={filterValues[filter.field] as string[]}
            />
          );
        default:
          return null;
      }
    }
    return <div />;
  };
}

function Filters({
  aggregations,
  filters,
  setFilters,
  filterValues,
  setFilterValues,
}: FiltersProps) {
  const filterItems = filters.map((filter) => ({
    label: filter.title,
    type: filter.type,
    content:
      filter.type && createFilterItemComponent(filter, aggregations, filterValues, setFilterValues),
  })) as FilterGroupProps['items'];

  return <FilterGroup items={filterItems} filters={filters} setFilters={setFilters} />;
}

export default function ControlPanel({
  aggregations,
  children,
  filters,
  setFilters,
  setOpen,
}: ControlPanelProps) {
  const [filterValues, setFilterValues] = useState<FilterValues>({});

  useEffect(() => {
    const values: FilterValues = {};
    filters.forEach((filter) => {
      values[filter.field as string] = filter.value;
    });
    setFilterValues(values);
  }, [filters]);

  const submitValues = () => {
    setFilters(filters.map((fil) => ({ ...fil, value: filterValues[fil.field] } as Filter)));
  };

  return (
    <div className="bg-primary-9 flex flex-col h-screen overflow-y-scroll pl-8 pr-16 py-6 shrink-0 space-y-4 w-[480px]">
      <button type="button" onClick={() => setOpen(false)} className="text-white text-right">
        <CloseOutlined />
      </button>
      <span className="flex font-bold gap-2 items-baseline text-2xl text-white">
        Filters<small className="font-light text-base text-primary-3">6 Active Columns</small>
      </span>

      <p className="text-white">
        Sed risus pretium quam vulputate dignissim. Sollicitudin aliquam ultrices sagittis orci a
        scelerisque.
      </p>

      <div className="flex flex-col gap-12">
        <Filters
          aggregations={aggregations}
          filters={filters}
          setFilters={setFilters}
          filterValues={filterValues}
          setFilterValues={setFilterValues}
        />
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
