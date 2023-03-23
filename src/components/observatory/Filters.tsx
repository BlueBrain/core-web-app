import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { useAtomValue, Atom, PrimitiveAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import { CheckboxOption, Filter, OptionsData } from '@/components/Filter/types';
import { CheckList, FilterGroup } from '@/components/Filter';

type FilterProps = {
  filters: Filter[];
  setFilters: Dispatch<SetStateAction<Filter[]>>;
};

type FiltersProps = {
  aggregationsAtom: Atom<Promise<any>>;
  filtersAtom: PrimitiveAtom<Filter[]>;
};

function Filters({ aggregationsAtom, filtersAtom }: FiltersProps) {
  const loadableAggs = useMemo(() => loadable(aggregationsAtom), [aggregationsAtom]);
  const aggs = useAtomValue(loadableAggs);

  // Option state is defined here to preserve selected state when "collapsing" filters
  const [contributors, setContributors] = useState<CheckboxOption[]>([]);
  const [eTypes, setETypes] = useState<CheckboxOption[]>([]);

  const createdByContent = ({ filters, setFilters }: FilterProps) => (
    <CheckList
      data={(aggs.state === 'hasData' && aggs.data ? aggs.data : []) as OptionsData}
      field="createdBy"
      filters={filters}
      options={contributors}
      setFilters={setFilters}
      setOptions={setContributors}
    />
  );

  const eTypeContent = ({ filters, setFilters }: FilterProps) => (
    <CheckList
      data={(aggs.state === 'hasData' && aggs.data ? aggs.data : []) as OptionsData}
      field="eType"
      filters={filters}
      options={eTypes}
      setFilters={setFilters}
      setOptions={setETypes}
    />
  );

  const filters = [
    {
      content: createdByContent,
      label: 'contributor',
    },
    {
      content: eTypeContent,
      label: 'eType',
    },
  ];

  return <FilterGroup items={filters} filtersAtom={filtersAtom} />;
}

type ControlPanelProps = {
  aggregationsAtom: Atom<Promise<any>>;
  filtersAtom: PrimitiveAtom<Filter[]>;
};

export default function ControlPanel({ aggregationsAtom, filtersAtom }: ControlPanelProps) {
  return (
    <div className="bg-primary-9 flex flex-col h-screen overflow-y-scroll pl-8 pr-16 py-10 space-y-4 w-[480px]">
      <span className="flex font-bold gap-2 items-baseline text-2xl text-white">
        Filters<small className="font-light text-base text-primary-3">6 Active Columns</small>
      </span>

      <p className="text-white">
        Sed risus pretium quam vulputate dignissim. Sollicitudin aliquam ultrices sagittis orci a
        scelerisque.
      </p>

      <Filters aggregationsAtom={aggregationsAtom} filtersAtom={filtersAtom} />
    </div>
  );
}
