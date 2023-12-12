import { Dispatch, ReactNode, SetStateAction, useEffect, useMemo, useState } from 'react';
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useAtom } from 'jotai';
import { unwrap } from 'jotai/utils';
import {
  Aggregations,
  Buckets,
  NestedBucketAggregation,
  NestedStatsAggregation,
  Statistics,
} from '@/types/explore-section/fields';
import { Filter, GteLteValue, ValueOrRangeFilter, RangeFilter } from '@/components/Filter/types';
import {
  CheckList,
  DateRange,
  FilterGroup,
  FilterGroupProps,
  defaultList,
} from '@/components/Filter';
import ValueRange from '@/components/Filter/ValueRange';
import ValueOrRange from '@/components/Filter/ValueOrRange';
import { FilterValues } from '@/types/explore-section/application';
import { activeColumnsAtom } from '@/state/explore-section/list-view-atoms';
import { getFieldEsConfig, getFieldLabel } from '@/api/explore-section/fields';

export type ControlPanelProps = {
  children?: ReactNode;
  toggleDisplay: () => void;
  experimentTypeName: string;
  aggregations?: Aggregations;
  filters: Filter[];
  setFilters: any;
};

function createFilterItemComponent(
  filter: Filter,
  aggregations: Aggregations | undefined,
  filterValues: FilterValues,
  setFilterValues: Dispatch<SetStateAction<FilterValues>>
) {
  return function FilterItemComponent() {
    const { type } = filter;
    const esConfig = getFieldEsConfig(filter.field);

    let agg;

    if (!aggregations) {
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

    if (!aggregations) return null;

    switch (type) {
      case 'dateRange':
        return (
          <DateRange
            filter={filter as RangeFilter}
            onChange={(values: GteLteValue) => updateFilterValues(filter.field, values)}
          />
        );

      case 'valueRange':
        if (esConfig?.nested) {
          const nestedAgg = aggregations[filter.field] as NestedStatsAggregation;
          agg = nestedAgg[filter.field][esConfig?.nested.aggregationName] as Statistics;
        } else {
          agg = aggregations[filter.field] as Statistics;
        }

        return (
          <ValueRange
            filter={filter as RangeFilter}
            aggregation={agg}
            onChange={(values: GteLteValue) => updateFilterValues(filter.field, values)}
          />
        );
      case 'checkList':
        if (esConfig?.nested) {
          const nestedAgg = aggregations[filter.field] as NestedBucketAggregation;
          agg = nestedAgg[filter.field][filter.field] as Buckets;
        } else {
          agg = aggregations[filter.field] as Buckets;
        }

        return (
          <CheckList
            data={agg}
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
  aggregations,
  filters,
  setFilters,
}: ControlPanelProps) {
  const [activeColumns, setActiveColumns] = useAtom(
    useMemo(() => unwrap(activeColumnsAtom({ experimentTypeName })), [experimentTypeName])
  );

  const [filterValues, setFilterValues] = useState<FilterValues>({});

  const onToggleActive = (key: string) => {
    if (!activeColumns) return;
    const existingIndex = activeColumns.findIndex((existingKey) => existingKey === key);

    if (existingIndex === -1) {
      // @ts-ignore
      setActiveColumns([...activeColumns, key]);
    } else {
      // @ts-ignore
      setActiveColumns([
        ...activeColumns.slice(0, existingIndex),
        ...activeColumns.slice(existingIndex + 1),
      ]);
    }
  };

  useEffect(() => {
    const values: FilterValues = {};

    filters?.forEach((filter: Filter) => {
      values[filter.field as string] = filter.value;
    });

    setFilterValues(values);
  }, [filters]);

  const submitValues = () => {
    setFilters(
      // @ts-ignore // TODO: remove this and fix the type error
      filters?.map((fil: Filter) => ({ ...fil, value: filterValues[fil.field] } as Filter))
    );
  };

  if (!activeColumns) return null;

  const activeColumnsLength = activeColumns.length ? activeColumns.length - 1 : 0;
  const activeColumnsText = `${activeColumnsLength} active ${
    activeColumnsLength === 1 ? 'column' : 'columns'
  }`;

  const filterItems = filters?.map((filter) => ({
    content:
      filter.type && createFilterItemComponent(filter, aggregations, filterValues, setFilterValues),
    display: activeColumns?.includes(filter.field),
    label: getFieldLabel(filter.field),
    type: filter.type,
    toggleFunc: () => onToggleActive && onToggleActive(filter.field),
  })) as FilterGroupProps['items'];

  return (
    <div
      data-testid="listing-view-filter-panel"
      className="z-10 fixed top-0 right-0 bg-primary-8 flex flex-col h-screen overflow-y-scroll pl-8 pr-16 py-6 shrink-0 space-y-4 w-[480px]"
    >
      <button
        type="button"
        onClick={toggleDisplay}
        className="text-white text-right"
        aria-label="Close"
      >
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
        {/* @ts-ignore : TODO: remove this and fix the type error */}
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
