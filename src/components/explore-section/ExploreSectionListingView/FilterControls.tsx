import {
  Dispatch,
  HTMLProps,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import { Spin } from 'antd';
import ExploreSectionNameSearch from '@/components/explore-section/ExploreSectionListingView/ExploreSectionNameSearch';
import SettingsIcon from '@/components/icons/Settings';
import { filterHasValue } from '@/components/Filter/util';
import { activeColumnsAtom } from '@/state/explore-section/list-view-atoms';
import { Filter } from '@/components/Filter/types';
import { DataType } from '@/constants/explore-section/list-views';
import { classNames } from '@/util/utils';

function FilterBtn({ disabled, children, onClick }: HTMLProps<HTMLButtonElement>) {
  return (
    <button
      className={classNames(
        'flex gap-10 items-center justify-between rounded-md py-2 px-2 max-h-[3rem] border-neutral-2 border',
        disabled ? 'bg-neutral-100 cursor-not-allowed' : 'bg-white'
      )}
      onClick={onClick}
      type="button"
      aria-label="listing-view-filter-button"
      disabled={!!disabled}
    >
      {children}
      <SettingsIcon className="rotate-90 text-primary-8 h-4" />
    </button>
  );
}

export default function FilterControls({
  children,
  displayControlPanel,
  setDisplayControlPanel,
  dataType,
  filters,
  resourceId,
  disabled,
  className,
}: {
  children?: ReactNode;
  displayControlPanel: boolean;
  setDisplayControlPanel: Dispatch<SetStateAction<boolean>>;
  dataType: DataType;
  filters?: Filter[];
  resourceId?: string;
  disabled?: boolean;
  className?: HTMLProps<HTMLElement>['className'];
}) {
  const [activeColumnsLength, setActiveColumnsLength] = useState<number | undefined>(undefined);

  const activeColumns = useAtomValue(
    useMemo(() => unwrap(activeColumnsAtom({ dataType })), [dataType])
  );

  const selectedFiltersCount = filters
    ? filters.filter((filter) => filterHasValue(filter)).length
    : 0;

  useEffect(() => {
    if (activeColumns && activeColumns.length) {
      setActiveColumnsLength(activeColumns.length - 1);
    }
  }, [activeColumns]);

  return (
    <div
      className={classNames(
        'grid grid-cols-[max-content_1fr_max-content] items-center justify-between gap-5 w-full flex-1 max-h-14',
        className
      )}
    >
      <div className="w-max">{children}</div>
      {!resourceId && <ExploreSectionNameSearch dataType={dataType} />}
      <div className="w-full inline-flex gap-2 place-content-end">
        {/* only show search input on listing views. resource id is present on detail views. */}
        <FilterBtn disabled={disabled} onClick={() => setDisplayControlPanel(!displayControlPanel)}>
          <div className="flex gap-1 items-center">
            <span className="bg-primary-8 text-white text-sm font-bold px-2.5 py-1 rounded">
              {selectedFiltersCount}
            </span>
            <div className="flex items-center gap-2">
              <span
                className={classNames(
                  'text-sm font-bold leading-5',
                  disabled ? 'text-primary-8' : 'text-primary-8'
                )}
              >
                Filters
              </span>
              <span className="text-neutral-4 font-semibold text-xs leading-5">
                {activeColumnsLength ? (
                  <>
                    {activeColumnsLength} active{' '}
                    {activeColumnsLength === 1 ? ' column' : ' columns'}
                  </>
                ) : (
                  <Spin />
                )}
              </span>
            </div>
          </div>
        </FilterBtn>
      </div>
    </div>
  );
}
