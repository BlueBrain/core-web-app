import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { Loadable } from 'jotai/vanilla/utils/loadable';
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { loadable } from 'jotai/utils';
import { useAtom, useAtomValue } from 'jotai';
import { Aggregations, NestedStatsAggregation, Statistics } from '@/types/explore-section/fields';
import { Filter, OptionsData, RangeFilter } from '@/components/Filter/types';
import { CheckList, DateRange, FilterGroup, FilterGroupProps } from '@/components/Filter';
import ValueRange from '@/components/Filter/ValueRange';
import { FilterValues } from '@/types/explore-section/application';
import LISTING_CONFIG from '@/constants/explore-section/es-terms-render';
import { aggregationsAtom, filtersAtom } from '@/state/explore-section/list-view-atoms';

export type ControlPanelProps = {
  activeColumns: string[];
  children?: ReactNode;
  onToggleActive?: (key: string) => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const aggregationsLoadable = loadable(aggregationsAtom);

function createFilterItemComponent(
  filter: Filter,
  aggregations: Loadable<Aggregations | undefined>,
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
            <CheckList
              data={aggregations.data as OptionsData}
              filter={filter}
              values={filterValues[filter.field] as string[]}
              setFilterValues={setFilterValues}
            />
          );
        default:
          return null;
      }
    }
    return <div />;
  };
}

export default function ControlPanel({
  activeColumns,
  children,
  onToggleActive,
  setOpen,
}: ControlPanelProps) {
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const aggregations = useAtomValue(aggregationsLoadable);
  const [filters, setFilters] = useAtom(filtersAtom);

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
    label: LISTING_CONFIG[filter.field].title,
    type: filter.type,
    toggleFunc: () => onToggleActive && onToggleActive(filter.field),
  })) as FilterGroupProps['items'];

  return (
    <div className="bg-primary-9 flex flex-col h-screen overflow-y-scroll pl-8 pr-16 py-6 shrink-0 space-y-4 w-[480px]">
      <button type="button" onClick={() => setOpen(false)} className="text-white text-right">
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
