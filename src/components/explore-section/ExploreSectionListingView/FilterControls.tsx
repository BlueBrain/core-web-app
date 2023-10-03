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
import AdvancedSearch from './AdvancedSearch';
import ExploreSectionNameSearch from '@/components/explore-section/ExploreSectionListingView/ExploreSectionNameSearch';
import ClearFilters from '@/components/explore-section/ExploreSectionListingView/ClearFilters';
import SettingsIcon from '@/components/icons/Settings';
import { filterHasValue } from '@/components/Filter/util';
import {
  filtersAtom,
  searchStringAtom,
  activeColumnsAtom,
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
  children,
  displayControlPanel,
  setDisplayControlPanel,
  experimentTypeName,
  resourceId,
}: {
  children?: ReactNode;
  displayControlPanel: boolean;
  setDisplayControlPanel: Dispatch<SetStateAction<boolean>>;
  experimentTypeName: string;
  resourceId?: string;
}) {
  const [activeColumnsLength, setActiveColumnsLength] = useState<number | undefined>(undefined);

  const activeColumns = useAtomValue(
    useMemo(() => unwrap(activeColumnsAtom({ experimentTypeName })), [experimentTypeName])
  );

  const filters = useAtomValue(
    useMemo(
      () => unwrap(filtersAtom({ experimentTypeName, resourceId })),
      [experimentTypeName, resourceId]
    )
  );
  const resetFilters = useResetAtom(filtersAtom({ experimentTypeName, resourceId }));
  const setSearchString = useSetAtom(searchStringAtom({ experimentTypeName, resourceId }));

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
      <ExploreSectionNameSearch experimentTypeName={experimentTypeName} resourceId={resourceId} />
      <FilterBtn onClick={() => setDisplayControlPanel(!displayControlPanel)}>
        <div className="flex gap-3 items-center">
          <span className="bg-primary-1 text-primary-9 text-sm font-medium px-2.5 py-1 rounded dark:bg-primary-1 dark:text-primary-9">
            {selectedFiltersCount}
          </span>
          <span className="font-bold text-white">Filters</span>
          <span className="text-primary-3 text-sm">
            {activeColumnsLength ? (
              <>
                {activeColumnsLength} active {activeColumnsLength === 1 ? ' column' : ' columns'}
              </>
            ) : (
              <Spin />
            )}
          </span>
        </div>
      </FilterBtn>
      <AdvancedSearch />
    </div>
  );
}
