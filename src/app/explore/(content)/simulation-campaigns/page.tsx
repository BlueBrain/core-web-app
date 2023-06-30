'use client';

import { Dispatch, HTMLProps, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { SearchOutlined } from '@ant-design/icons';
import { BrainIcon, InteractiveViewIcon, SettingsIcon, VirtualLabIcon } from '@/components/icons';
import ControlPanel, { ControlPanelProps } from '@/components/explore-section/ControlPanel';
import { useFilterList } from '@/hooks';
import createListViewAtoms from '@/state/explore-section/list-atoms-constructor';
import { useListViewAtoms } from '@/hooks/useListViewAtoms';
import { FilterMethods, FilterType, FilterValues, createFilterValues } from '@/hooks/useFilterList';
import ListTable from '@/components/ListTable';
import { filterHasValue } from '@/components/Filter/util';
import FilterListItem from '@/components/FilterList';
import { FilterGroup } from '@/components/Filter';
import { simulationsAtom } from '@/state/explore-section/simulation-campaign';

function FilterBtn({ onClick, value }: HTMLProps<HTMLButtonElement>) {
  return (
    <button
      className="bg-primary-8 flex gap-10 items-center justify-between max-h-[56px] rounded-md p-5"
      onClick={onClick}
      type="button"
    >
      <div className="flex gap-3 items-center">
        <span className="bg-white rounded-md px-2 py-1 text-neutral-3 text-sm">{value}</span>
        <span className="font-bold text-white">Filters</span>
        <span className="text-primary-3 text-sm"> 6 active columns</span>
      </div>
      <SettingsIcon className="rotate-90 text-white" />
    </button>
  );
}

function FirstColumnContent(text: string) {
  return (
    <div className="flex flex-col gap-5">
      <span className="font-bold">{text}</span>
      <div className="flex items-center gap-3">
        <span className="text-neutral-4 text-sm uppercase">Open in</span>
        <span className="border border-neutral-4 p-2 text-primary-7">
          <InteractiveViewIcon />
        </span>
        <span className="border border-neutral-4 p-2 text-primary-7">
          <BrainIcon />
        </span>
        <span className="border border-neutral-4 p-2 text-primary-7">
          <VirtualLabIcon />
        </span>
      </div>
    </div>
  );
}

const TYPE = 'https://neuroshapes.org/SimulationCampaign'; // TODO: Check whether this type actually exists.

const defaultColumns = [
  { dataIndex: 'name', key: 'name', label: 'name', render: FirstColumnContent },
  { dataIndex: 'brainConfiguration', key: 'configuration', label: 'configuration' },
  { dataIndex: 'coords.vpm_pct', key: 'vpmPct', label: 'vpm_pct' },
  {
    dataIndex: 'coords.extracellular_calcium',
    key: 'extracellularCalcium',
    label: 'extracellular_calcium',
  },
  { dataIndex: 'coords.celsius', key: 'celsius', label: 'celsius' },
  // { dataIndex: 'startDelay', key: 'startDelay', label: 'start_delay' },
  { dataIndex: 'startedAt', key: 'startedAt', label: 'started_at' },
];

const {
  activeColumnsAtom,
  aggregationsAtom,
  dataAtom,
  filtersAtom,
  pageSizeAtom,
  searchStringAtom,
  sortStateAtom,
  totalAtom,
} = createListViewAtoms({
  type: TYPE,
  columns: defaultColumns.map((col) => col.dataIndex),
});

const otherColumns = [
  {
    dataIndex: 'coords.desired_connected_proportion_of_invivo_frs',
    key: 'desired_connected_proportion_of_invivo_frs',
    label: 'desired_connected_proportion_of_invivo_frs',
  },
  {
    dataIndex: 'coords.depol_stdev_mean_ratio',
    label: 'depol_stdev_mean_ratio',
    key: 'deplStdevMeanRatio',
  },
];

function getFilterListItem({
  checked,
  key,
  label,
  onRadioChange,
  onRangeChange,
  onValueChange,
  options,
  range,
  toggleFunc,
  type,
  value,
}: {
  checked: boolean;
  key: string;
  label: string;
  onRadioChange: FilterMethods['onRadioChange'];
  onRangeChange: FilterMethods['onRangeChange'];
  onValueChange: FilterMethods['onValueChange'];
  options: FilterType[];
  range: FilterValues['range'];
  toggleFunc?: () => void;
  type: FilterValues['type'];
  value: FilterValues['value'];
}) {
  return {
    display: checked,
    content: () => (
      <FilterListItem
        id={key}
        key={key}
        onRadioChange={onRadioChange}
        onRangeChange={onRangeChange}
        onValueChange={onValueChange}
        options={options}
        range={range}
        type={type}
        value={value}
      />
    ),
    label,
    toggleFunc,
  };
}

function ControlPanelWithDimensions({
  activeColumns,
  getValues,
  getMethods,
  options,
  setOpen,
}: Omit<ControlPanelProps, 'setActiveColumns'> & {
  getValues: (id: string) => FilterValues;
  getMethods: (id: string) => FilterMethods;
  options: FilterType[];
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [filters, setFilters] = useAtom(filtersAtom);

  return (
    <ControlPanel activeColumns={activeColumns} setOpen={setOpen}>
      <div>
        <span className="flex font-bold gap-2 items-baseline text-2xl text-white">
          Dimensions
          <small className="font-light text-base text-primary-3">({otherColumns.length})</small>
        </span>
        <p className="text-white">
          Sed risus pretium quam vulputate dignissim. Sollicitudin aliquam ultrices sagittis orci a
          scelerisque.
        </p>
        <div className="divide-neutral-3 divide-y flex flex-col gap-7">
          <FilterGroup
            filters={filters}
            setFilters={setFilters}
            items={otherColumns.map(({ key, label }) => {
              const { checked, range, type, value } = getValues(key);
              const { toggleColumn, onRadioChange, onRangeChange, onValueChange } = getMethods(key);

              return getFilterListItem({
                checked,
                key,
                label,
                onRadioChange,
                onRangeChange,
                onValueChange,
                options,
                range,
                toggleFunc: () => toggleColumn(key),
                type,
                value,
              });
            })}
          />
        </div>
      </div>
    </ControlPanel>
  );
}

export default function SimulationCampaignPage() {
  const [openFiltersSidebar, setOpenFiltersSidebar] = useState(false);
  const filters = useAtomValue(filtersAtom);

  const atoms = useListViewAtoms({
    activeColumns: activeColumnsAtom,
    aggregations: useMemo(() => loadable(aggregationsAtom), []),
    data: useMemo(() => loadable(dataAtom), []),
    filters: filtersAtom,
    pageSize: pageSizeAtom,
    searchString: searchStringAtom,
    sortState: sortStateAtom,
    total: useMemo(() => loadable(totalAtom), []),
  });

  const {
    activeColumns: [activeColumns, setActiveColumns],
  } = atoms;

  // Display all columns by default.
  useEffect(
    () => () => setActiveColumns(['index', ...defaultColumns.map((col) => col.dataIndex)]),
    [setActiveColumns]
  );

  const mockDataSource = useAtomValue(simulationsAtom);

  const defaultFilterState = otherColumns.map(({ key }) => createFilterValues({ id: key }));

  const { checkForActiveFilters, getValues, getMethods, options } =
    useFilterList(defaultFilterState);

  const selectedFiltersCount = filters.filter((filter) => filterHasValue(filter)).length;

  return (
    <div className="flex">
      <div className="flex flex-col gap-10 h-screen overflow-scroll pt-10 w-full">
        <h1 className="font-bold pl-7 pr-16 text-primary-7 text-2xl">Simulation Campaigns</h1>
        <div className="bg-neutral-1 flex flex-col grow gap-10 pl-7 pr-16 pt-10">
          <h2 className="font-bold text-primary-7">Public Campaigns</h2>
          <div className="flex items-center justify-between">
            <span className="font-bold text-primary-7">{`Total: ${3200} campaigns`}</span>
            <div className="flex gap-4 items-center">
              <span className="text-neutral-4">Clear filters</span>
              <SearchOutlined className="border border-primary-3 p-2 text-primary-7" />
              <FilterBtn
                onClick={() => setOpenFiltersSidebar(!openFiltersSidebar)}
                value={selectedFiltersCount}
              />
            </div>
          </div>
          <ListTable
            columns={[...defaultColumns, ...otherColumns.filter(checkForActiveFilters)]}
            dataSource={mockDataSource.map(({ id, ...rest }) => ({ ...rest, id, key: id }))} // Add a "key" for each row.
          />
        </div>
      </div>
      {openFiltersSidebar && (
        <ControlPanelWithDimensions
          activeColumns={activeColumns}
          getValues={getValues}
          getMethods={getMethods}
          options={options}
          setOpen={setOpenFiltersSidebar}
        />
      )}
    </div>
  );
}
