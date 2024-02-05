import {
  ChangeEvent,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { Input, Spin } from 'antd';
import { useAtom, useSetAtom } from 'jotai';
import { unwrap, useResetAtom } from 'jotai/utils';
import {
  Aggregations,
  Buckets,
  NestedBucketAggregation,
  NestedStatsAggregation,
  Statistics,
} from '@/types/explore-section/fields';
import { Filter, GteLteValue, ValueOrRangeFilter } from '@/components/Filter/types';
import { CheckList, DateRange, defaultList, FilterGroup } from '@/components/Filter';
import ValueRange from '@/components/Filter/ValueRange';
import ValueOrRange from '@/components/Filter/ValueOrRange';
import { FilterValues } from '@/types/explore-section/application';
import {
  activeColumnsAtom,
  filtersAtom,
  searchStringAtom,
} from '@/state/explore-section/list-view-atoms';
import { getFieldEsConfig, getFieldLabel } from '@/api/explore-section/fields';
import { FilterTypeEnum } from '@/types/explore-section/filters';
import { DataType } from '@/constants/explore-section/list-views';
import ClearFilters from '@/components/explore-section/ExploreSectionListingView/ClearFilters';

export type ControlPanelProps = {
  children?: ReactNode;
  toggleDisplay: () => void;
  dataType: DataType;
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
      case FilterTypeEnum.DateRange:
        return (
          <DateRange
            filter={filter}
            onChange={(values: GteLteValue) => updateFilterValues(filter.field, values)}
          />
        );

      case FilterTypeEnum.ValueRange:
        if (esConfig?.nested) {
          const nestedAgg = aggregations[filter.field] as NestedStatsAggregation;
          agg = nestedAgg[filter.field][esConfig?.nested.aggregationName];
        } else {
          agg = aggregations[filter.field] as Statistics;
        }

        return (
          <ValueRange
            filter={filter}
            aggregation={agg}
            onChange={(values: GteLteValue) => updateFilterValues(filter.field, values)}
          />
        );

      case FilterTypeEnum.CheckList:
        if (esConfig?.nested) {
          const nestedAgg = aggregations[filter.field] as NestedBucketAggregation;
          agg = nestedAgg[filter.field][filter.field];
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

      case FilterTypeEnum.ValueOrRange:
        return (
          <ValueOrRange
            filter={filter}
            setFilter={(value: ValueOrRangeFilter['value']) =>
              updateFilterValues(filter.field, value)
            }
          />
        );

      case FilterTypeEnum.Text:
        return (
          <div className="flex flex-col gap-2">
            <Input
              value={filterValues[filter.field] as string}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                updateFilterValues(filter.field, event.target.value)
              }
            />
            <span>
              Use the asterix character (<code className="text-semibold font-mono">*</code>) to
              specify a &quot;wildcard&quot; for your search. For example; to search for names{' '}
              <i>beginning with</i> &quot;AA11&quot;, specify{' '}
              <code className="text-semibold font-mono">AA11*</code>. To search for names{' '}
              <i>containing</i> &quot;L5-2&quot;, specify{' '}
              <code className="text-bold font-mono">*L5-2*</code>.
            </span>
          </div>
        );

      default:
        return null;
    }
  };
}

export default function ControlPanel({
  children,
  toggleDisplay,
  dataType,
  aggregations,
  filters,
  setFilters,
}: ControlPanelProps) {
  const [activeColumns, setActiveColumns] = useAtom(
    useMemo(() => unwrap(activeColumnsAtom({ dataType })), [dataType])
  );

  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const resetFilters = useResetAtom(filtersAtom({ dataType }));
  const setSearchString = useSetAtom(searchStringAtom({ dataType }));

  const onToggleActive = (key: string) => {
    if (!activeColumns) return;
    const existingIndex = activeColumns.findIndex((existingKey) => existingKey === key);

    if (existingIndex === -1) {
      setActiveColumns([...activeColumns, key]);
    } else {
      setActiveColumns([
        ...activeColumns.slice(0, existingIndex),
        ...activeColumns.slice(existingIndex + 1),
      ]);
    }
  };

  useEffect(() => {
    const values: FilterValues = {};

    filters?.forEach((filter: Filter) => {
      values[filter.field] = filter.value;
    });

    setFilterValues(values);
  }, [filters]);

  const submitValues = () => {
    setFilters(filters?.map((fil: Filter) => ({ ...fil, value: filterValues[fil.field] })));
  };

  if (!activeColumns) return null;

  const activeColumnsLength = activeColumns.length ? activeColumns.length - 1 : 0;
  const activeColumnsText = `${activeColumnsLength} active ${
    activeColumnsLength === 1 ? 'column' : 'columns'
  }`;

  const filterItems = filters?.map((filter) => {
    return {
      content: filter.type
        ? createFilterItemComponent(filter, aggregations, filterValues, setFilterValues)
        : undefined,
      display: activeColumns?.includes(filter.field),
      label: getFieldLabel(filter.field),
      type: filter.type,
      toggleFunc: () => onToggleActive && onToggleActive(filter.field),
    };
  });

  // The columnKeyToFilter method receives a string (key)
  // and in this case it is the equivalent to a filters[x].field
  const clearFilters = () => {
    resetFilters();
    setSearchString('');
  };

  return (
    <div
      data-testid="listing-view-filter-panel"
      className="relative right-0 top-0 z-10 flex w-[480px] shrink-0 flex-col space-y-4 overflow-y-auto bg-primary-8 pl-8 pr-16 pt-6"
    >
      <div>
        <button
          autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          type="button"
          onClick={toggleDisplay}
          className="float-right text-white"
          aria-label="Close"
        >
          <CloseOutlined />
        </button>
        <span className="flex items-baseline gap-2 text-2xl font-bold text-white">
          Filters
          <small className="text-base font-light text-primary-3">{activeColumnsText}</small>
        </span>

        <p className="text-white">
          Use the eye icon to hide/show columns. Select the column titles and tick the checkbox of
          the option(s).
        </p>

        <div className="flex flex-col gap-12">
          <FilterGroup items={filterItems} filters={filters} setFilters={setFilters} />
          {children}
        </div>
      </div>

      <div className="sticky bottom-0 left-0 flex w-full items-center justify-between bg-primary-8 px-4 py-6">
        <ClearFilters onClick={clearFilters} />
        <button
          type="submit"
          onClick={submitValues}
          className="bg-primary-2 px-8 py-3 text-primary-9"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
