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

export function FilterBtn({ disabled, children, onClick }: HTMLProps<HTMLButtonElement>) {
  return (
    <button
      className={classNames(
        'flex max-h-[3rem] items-center justify-between gap-10 rounded-md border border-neutral-2 px-2 py-2',
        disabled ? 'cursor-not-allowed bg-neutral-100' : 'bg-white'
      )}
      onClick={onClick}
      type="button"
      aria-label="listing-view-filter-button"
      disabled={!!disabled}
    >
      {children}
      <SettingsIcon className="h-4 rotate-90 text-primary-8" />
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
        'grid max-h-14 w-full flex-1 grid-cols-[max-content_1fr_max-content] items-center justify-between gap-5 py-5',
        className
      )}
    >
      <div className="w-max">{children}</div>
      {!resourceId && <ExploreSectionNameSearch dataType={dataType} />}
      <div className="inline-flex w-full place-content-end gap-2">
        {/* only show search input on listing views. resource id is present on detail views. */}
        <FilterBtn disabled={disabled} onClick={() => setDisplayControlPanel(!displayControlPanel)}>
          <div className="flex items-center gap-1">
            <span className="rounded bg-primary-8 px-2.5 py-1 text-sm font-bold text-white">
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
              <span className="text-xs font-semibold leading-5 text-neutral-4">
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
