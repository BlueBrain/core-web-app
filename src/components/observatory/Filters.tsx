import { Dispatch, SetStateAction, useState } from 'react';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { aggregationsAtom } from '@/state/ephys';
import { CheckboxOption, Filter, OptionsData } from '@/components/Filter/types';
import { CheckList, FilterGroup } from '@/components/Filter';

const loadableAggs = loadable(aggregationsAtom);

type FilterProps = {
  filters: Filter[];
  setFilters: Dispatch<SetStateAction<Filter[]>>;
};

function Filters() {
  const aggs = useAtomValue(loadableAggs);

  // Option state is defined here to preserve selected state when "collapsing" filters
  const [contributors, setContributors] = useState<CheckboxOption[]>([]);
  const [eTypes, setETypes] = useState<CheckboxOption[]>([]);

  const contributorContent = ({ filters, setFilters }: FilterProps) => (
    <CheckList
      data={(aggs.state === 'hasData' && aggs.data ? aggs.data.contributor : []) as OptionsData}
      field="contributor"
      filters={filters}
      options={contributors}
      setFilters={setFilters}
      setOptions={setContributors}
    />
  );

  const eTypeContent = ({ filters, setFilters }: FilterProps) => (
    <CheckList
      data={(aggs.state === 'hasData' && aggs.data ? aggs.data.eType : []) as OptionsData}
      field="eType"
      filters={filters}
      options={eTypes}
      setFilters={setFilters}
      setOptions={setETypes}
    />
  );

  const filters = [
    {
      content: contributorContent,
      label: 'contributor',
    },
    {
      content: eTypeContent,
      label: 'eType',
    },
  ];

  return <FilterGroup items={filters} />;
}

export default function ControlPanel() {
  return (
    <div className="bg-primary-9 flex flex-col h-screen overflow-y-scroll pl-8 pr-16 py-10 space-y-4 w-[480px]">
      <span className="flex font-bold gap-2 items-baseline text-2xl text-white">
        Filters<small className="font-light text-base text-primary-3">6 Active Columns</small>
      </span>

      <p className="text-white">
        Sed risus pretium quam vulputate dignissim. Sollicitudin aliquam ultrices sagittis orci a
        scelerisque.
      </p>

      <Filters />
    </div>
  );
}
