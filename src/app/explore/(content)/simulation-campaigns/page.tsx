'use client';

import { SearchOutlined } from '@ant-design/icons';
import mockDataSource from './mockData';
import { BrainIcon, InteractiveViewIcon, SettingsIcon, VirtualLabIcon } from '@/components/icons';
import { useSearchBtn, useFilterList } from '@/hooks';
import { createFilterValues } from '@/hooks/useFilterList';
import InputButton from '@/components/InputButton';
import ListTable from '@/components/ListTable';
import FilterList from '@/components/FilterList';

function FilterBtn() {
  return (
    <button
      type="button"
      className="bg-primary-8 flex gap-10 items-center justify-between max-h-[56px] rounded-md p-5"
    >
      <div className="flex gap-3 items-center">
        <span className="bg-white rounded-md px-2 py-1 text-neutral-3 text-sm">0</span>
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

const defaultColumns = [
  { id: 'name', label: 'name', render: FirstColumnContent },
  { id: 'configuration', label: 'configuration' },
  { id: 'ca', label: 'ca' },
  { id: 'vpmPct', label: 'vpm_pct' },
  { id: 'startDelay', label: 'start_delay' },
  { id: 'date', label: 'date' },
];

const otherColumns = [
  {
    id: 'desiredConnectedProportionOfInvivoFrs',
    label: 'desired_connected_proportion_of_invivo_frs',
  },
  {
    id: 'deplStdevMeanRatio',
    label: 'depol_stdev_mean_ratio',
  },
];

export default function SimulationCampaignPage() {
  const defaultFilterState = otherColumns.map(({ id }) => createFilterValues({ id }));

  const { applyActiveFilters, checkForActiveFilters, getValues, getMethods, options } =
    useFilterList(defaultFilterState);

  const { focused, onBlur, onClick, onInput, value: inputValue } = useSearchBtn('');

  return (
    <div className="flex flex-col gap-10 h-screen overflow-scroll pt-10 w-full">
      <h1 className="font-bold pl-7 pr-16 text-primary-7 text-2xl">Simulation Campaigns</h1>
      <div className="bg-neutral-1 flex flex-col grow gap-10 pl-7 pr-16 pt-10">
        <h2 className="font-bold text-primary-7">Public Campaigns</h2>
        <div className="flex items-center justify-between">
          <span className="font-bold text-primary-7">{`Total: ${3200} campaigns`}</span>
          <div className="flex gap-4 items-center">
            <span className="text-neutral-4">Clear filters</span>
            <SearchOutlined className="border border-primary-3 p-2 text-primary-7" />
            <InputButton
              focused={focused}
              onBlur={onBlur}
              onClick={onClick}
              onInput={onInput}
              value={inputValue}
              type="text"
            />
            <FilterBtn />
          </div>
        </div>
        <FilterList
          getMethods={getMethods}
          getValues={getValues}
          items={
            otherColumns.filter(({ label }) => label.includes(inputValue)) // TODO: Replace this with something smarter (and case-sensitive).
          }
          options={options}
        />
        <ListTable
          columns={[...defaultColumns, ...otherColumns.filter(checkForActiveFilters)]}
          dataSource={mockDataSource.filter(applyActiveFilters)}
        />
      </div>
    </div>
  );
}
