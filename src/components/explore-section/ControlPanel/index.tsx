import { SetStateAction, Dispatch, useMemo, useState } from 'react';
import { useAtomValue, Atom, PrimitiveAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import { CloseOutlined } from '@ant-design/icons';
import { CheckboxOption, Filter, OptionsData } from '@/components/Filter/types';
import { CheckList, FilterGroup, FilterGroupProps } from '@/components/Filter';

type FilterProps = {
  filters: Filter[];
  setFilters: Dispatch<SetStateAction<Filter[]>>;
};

type FiltersProps = {
  aggregationsAtom: Atom<Promise<any>>;
  filtersAtom: PrimitiveAtom<Filter[]>;
};

function createFilterItemComponent(filter: Filter, aggregationsAtom: Atom<Promise<any>>) {
  return function FilterItemComponent({ filters, setFilters }: FilterProps) {
    const [options, setOptions] = useState<CheckboxOption[]>([]);
    const loadableAggs = useMemo(() => loadable(aggregationsAtom), []);
    const aggs = useAtomValue(loadableAggs);

    return (
      <CheckList
        data={(aggs.state === 'hasData' && aggs.data ? aggs.data : []) as OptionsData}
        filter={filter}
        filters={filters}
        options={options}
        setFilters={setFilters}
        setOptions={setOptions}
      />
    );
  };
}

function Filters({ aggregationsAtom, filtersAtom }: FiltersProps) {
  const filters = useAtomValue(filtersAtom);

  const filterItems: FilterGroupProps['items'] = filters.map((filter) => ({
    label: filter.title,
    content: createFilterItemComponent(filter, aggregationsAtom),
  }));

  return <FilterGroup items={filterItems} filtersAtom={filtersAtom} />;
}

type ControlPanelProps = {
  aggregationsAtom: Atom<Promise<any>>;
  filtersAtom: PrimitiveAtom<Filter[]>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ControlPanel({
  aggregationsAtom,
  filtersAtom,
  setOpen,
}: ControlPanelProps) {
  return (
    <div className="bg-primary-9 flex flex-col h-screen overflow-y-scroll px-8 py-6 space-y-4 w-[480px]">
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

      <Filters aggregationsAtom={aggregationsAtom} filtersAtom={filtersAtom} />
    </div>
  );
}
