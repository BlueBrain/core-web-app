import { Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { Loadable } from 'jotai/vanilla/utils/loadable';
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { Aggregations, StatsAggregation } from '@/types/explore-section/fields';
import { CheckboxOption, Filter, OptionsData, RangeFilter } from '@/components/Filter/types';
import { CheckList, DateRange, FilterGroup, FilterGroupProps } from '@/components/Filter';
import ValueRange from '@/components/Filter/ValueRange';

type FiltersProps = {
  aggregations: Loadable<Aggregations>;
  filters: Filter[];
  setFilters: Dispatch<SetStateAction<Filter[]>>;
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
  filters,
  setFilters,
}: {
  aggregations: Loadable<Aggregations>;
  filter: Filter;
  filters: Filter[];
  setFilters: Dispatch<SetStateAction<Filter[]>>;
}) {
  const [options, setOptions] = useState<CheckboxOption[]>([]);

  return (
    <CheckList
      data={
        (aggregations.state === 'hasData' && aggregations.data
          ? aggregations.data
          : []) as OptionsData
      }
      filter={filter}
      filters={filters}
      options={options}
      setFilters={setFilters}
      setOptions={setOptions}
    />
  );
}

function createFilterItemComponent(filter: Filter, aggregations: Loadable<Aggregations>) {
  return function FilterItemComponent({ filters, setFilters }: Omit<FiltersProps, 'aggregations'>) {
    const { type } = filter;
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
          return (
            <DateRange filter={filter as RangeFilter} filters={filters} setFilters={setFilters} />
          );
        case 'valueRange':
          return (
            <ValueRange
              filter={filter as RangeFilter}
              filters={filters}
              setFilters={setFilters}
              aggregation={aggregations.data[filter.field] as StatsAggregation}
            />
          );
        case 'checkList':
          return (
            <CheckListWrapper
              aggregations={aggregations}
              filter={filter}
              filters={filters}
              setFilters={setFilters}
            />
          );
        default:
          return null;
      }
    }
    return <div />;
  };
}

function Filters({ aggregations, filters, setFilters }: FiltersProps) {
  const filterItems = filters.map((filter) => ({
    label: filter.title,
    type: filter.type,
    content: filter.type && createFilterItemComponent(filter, aggregations),
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
        <Filters aggregations={aggregations} filters={filters} setFilters={setFilters} />
        {children}
      </div>
    </div>
  );
}
