import { Dispatch, HTMLProps, SetStateAction } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import columnKeyToFilter from '@/state/explore-section/column-key-to-filter';
import ExploreSectionNameSearch from '@/components/explore-section/ExploreSectionListingView/ExploreSectionNameSearch';
import ClearFilters from '@/components/explore-section/ExploreSectionListingView/ClearFilters';
import SettingsIcon from '@/components/icons/Settings';
import { filterHasValue } from '@/components/Filter/util';
import {
  activeColumnsAtom,
  filtersAtom,
  searchStringAtom,
} from '@/state/explore-section/list-view-atoms';

function FilterBtn({ children, onClick }: HTMLProps<HTMLButtonElement>) {
  return (
    <button
      className="bg-primary-8 flex gap-10 items-center justify-between max-h-[56px] rounded-md p-5"
      onClick={onClick}
      type="button"
    >
      {children}
      <SettingsIcon className="rotate-90 text-white" />
    </button>
  );
}

export default function FilterControls({
  displayControlPanel,
  setDisplayControlPanel,
  type,
}: {
  displayControlPanel: boolean;
  setDisplayControlPanel: Dispatch<SetStateAction<boolean>>;
  type: string;
}) {
  const activeColumns = useAtomValue(activeColumnsAtom(type));
  const [filters, setFilters] = useAtom(filtersAtom(type));
  const setSearchString = useSetAtom(searchStringAtom);

  const selectedFiltersCount = filters.filter((filter) => filterHasValue(filter)).length;

  // The columnKeyToFilter method receives a string (key) and in this case it is the equivalent to a filters[x].field
  const clearFilters = () => {
    setFilters(filters.map((fil) => columnKeyToFilter(fil.field)));
    setSearchString('');
  };

  const activeColumnsLength = activeColumns.length ? activeColumns.length - 1 : 0;
  const activeColumnsText = `${activeColumnsLength} active ${
    activeColumnsLength === 1 ? 'column' : 'columns'
  }`;

  return (
    <div className="flex items-center gap-5 justify-between w-auto">
      <ClearFilters onClick={clearFilters} />
      <ExploreSectionNameSearch />
      <FilterBtn onClick={() => setDisplayControlPanel(!displayControlPanel)}>
        <div className="flex gap-3 items-center">
          <span className="bg-primary-1 text-primary-9 text-sm font-medium px-2.5 py-1 rounded dark:bg-primary-1 dark:text-primary-9">
            {selectedFiltersCount}
          </span>
          <span className="font-bold text-white">Filters</span>
          <span className="text-primary-3 text-sm">{activeColumnsText}</span>
        </div>
      </FilterBtn>
    </div>
  );
}
