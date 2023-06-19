import { Dispatch, SetStateAction, useState } from 'react';
import { Loadable } from 'jotai/vanilla/utils/loadable';
import { CloseOutlined } from '@ant-design/icons';
import { Aggregations } from '@/types/explore-section/fields';
import { CheckboxOption, Filter, OptionsData, RangeFilter } from '@/components/Filter/types';
import { CheckList, DateRange, FilterGroup, FilterGroupProps } from '@/components/Filter';

type FiltersProps = {
  aggregations: Loadable<Aggregations | undefined>;
  filters: Filter[];
  setFilters: Dispatch<SetStateAction<Filter[]>>;
};

type ControlPanelProps = {
  aggregations: Loadable<any>;
  filters: Filter[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFilters: Dispatch<SetStateAction<Filter[]>>;
};

function CheckListWrapper({
  aggregations,
  filter,
  filters,
  setFilters,
}: {
  aggregations: Loadable<Aggregations | undefined>;
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

function createFilterItemComponent(
  filter: Filter,
  aggregations: Loadable<Aggregations | undefined>
) {
  return function FilterItemComponent({ filters, setFilters }: Omit<FiltersProps, 'aggregations'>) {
    const { type } = filter;

    switch (type) {
      case 'dateRange':
        return (
          <DateRange filter={filter as RangeFilter} filters={filters} setFilters={setFilters} />
        );
      default:
        return (
          <CheckListWrapper
            aggregations={aggregations}
            filter={filter}
            filters={filters}
            setFilters={setFilters}
          />
        );
    }
  };
}

function Filters({ aggregations, filters, setFilters }: FiltersProps) {
  const filterItems: FilterGroupProps['items'] = filters.map((filter) => ({
    label: filter.title,
    content: createFilterItemComponent(filter, aggregations),
  }));

  return <FilterGroup items={filterItems} filters={filters} setFilters={setFilters} />;
}

export default function ControlPanel({
  aggregations,
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

      <Filters aggregations={aggregations} filters={filters} setFilters={setFilters} />
    </div>
  );
}
