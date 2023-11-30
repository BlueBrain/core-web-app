import {
  Dispatch,
  HTMLProps,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useResetAtom, unwrap } from 'jotai/utils';
import { Spin } from 'antd';
import ExploreSectionNameSearch from '@/components/explore-section/ExploreSectionListingView/ExploreSectionNameSearch';
import ClearFilters from '@/components/explore-section/ExploreSectionListingView/ClearFilters';
import SettingsIcon from '@/components/icons/Settings';
import { filterHasValue } from '@/components/Filter/util';
import {
  filtersAtom,
  searchStringAtom,
  activeColumnsAtom,
} from '@/state/explore-section/list-view-atoms';
import { Filter } from '@/components/Filter/types';

function FilterBtn({ disabled, children, onClick }: HTMLProps<HTMLButtonElement>) {
  return (
    <button
      className={`${
        disabled ? 'bg-neutral-100 cursor-not-allowed' : 'bg-primary-8'
      } flex gap-10 items-center justify-between max-h-[56px] rounded-md p-5`}
      onClick={onClick}
      type="button"
      aria-label="listing-view-filter-button"
      disabled={!!disabled}
    >
      {children}
      <SettingsIcon className="rotate-90 text-white" />
    </button>
  );
}

export default function FilterControls({
  children,
  displayControlPanel,
  setDisplayControlPanel,
  experimentTypeName,
  filters,
  resourceId,
  disabled,
}: {
  children?: ReactNode;
  displayControlPanel: boolean;
  setDisplayControlPanel: Dispatch<SetStateAction<boolean>>;
  experimentTypeName: string;
  filters?: Filter[];
  resourceId?: string;
  disabled?: boolean;
}) {
  const [activeColumnsLength, setActiveColumnsLength] = useState<number | undefined>(undefined);

  const activeColumns = useAtomValue(
    useMemo(() => unwrap(activeColumnsAtom({ experimentTypeName })), [experimentTypeName])
  );

  const resetFilters = useResetAtom(filtersAtom({ experimentTypeName, resourceId }));
  const setSearchString = useSetAtom(searchStringAtom({ experimentTypeName }));

  const selectedFiltersCount = filters
    ? filters.filter((filter) => filterHasValue(filter)).length
    : 0;

  // The columnKeyToFilter method receives a string (key) and in this case it is the equivalent to a filters[x].field
  const clearFilters = () => {
    resetFilters();
    setSearchString('');
  };

  useEffect(() => {
    if (activeColumns && activeColumns.length) {
      setActiveColumnsLength(activeColumns.length - 1);
    }
  }, [activeColumns]);

  return (
    <div className="flex items-center gap-5 justify-end pl-5 w-auto">
      <div className="mr-auto">{children}</div>
      <ClearFilters onClick={clearFilters} />
      {/* only show search input on listing views. resource id is present on detail views. */}
      {!resourceId && <ExploreSectionNameSearch experimentTypeName={experimentTypeName} />}
      <FilterBtn disabled={disabled} onClick={() => setDisplayControlPanel(!displayControlPanel)}>
        <div className="flex gap-3 items-center">
          <span className="bg-primary-1 text-primary-9 text-sm font-medium px-2.5 py-1 rounded dark:bg-primary-1 dark:text-primary-9">
            {selectedFiltersCount}
          </span>
          <div className="flex items-center">
            <span className={`${disabled ? 'text-primary-8' : 'text-white'} font-bold mb-1`}>
              Filters
            </span>
            <span className="text-primary-3 text-sm ml-2">
              {activeColumnsLength ? (
                <>
                  {activeColumnsLength} active {activeColumnsLength === 1 ? ' column' : ' columns'}
                </>
              ) : (
                <Spin />
              )}
            </span>
          </div>
        </div>
      </FilterBtn>
    </div>
  );
}
