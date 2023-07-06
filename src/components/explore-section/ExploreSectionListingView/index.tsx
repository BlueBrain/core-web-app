import { useCallback, useEffect, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { loadable } from 'jotai/utils';
import ExploreSectionNameSearch from '@/components/explore-section/ExploreSectionListingView/ExploreSectionNameSearch';
import ClearFilters from '@/components/explore-section/ExploreSectionListingView/ClearFilters';
import LoadMoreButton from '@/components/explore-section/ExploreSectionListingView/LoadMoreButton';
import ExploreSectionTable from '@/components/explore-section/ExploreSectionListingView/ExploreSectionTable';
import ControlPanel from '@/components/explore-section/ControlPanel';
import SettingsIcon from '@/components/icons/Settings';
import { filterHasValue } from '@/components/Filter/util';
import useExploreColumns from '@/hooks/useExploreColumns';
import {
  activeColumnsAtom,
  columnKeysAtom,
  dataAtom,
  filtersAtom,
  initializeActiveColumnsAtom,
  initializeFiltersAtom,
  pageSizeAtom,
  sortStateAtom,
  totalAtom,
} from '@/state/explore-section/list-view-atoms';
import styles from '@/components/explore-section/ControlPanel/filters.module.scss';

interface ExploreSectionPageProps {
  title: string;
  enableDownload?: boolean;
}

const totalLoadable = loadable(totalAtom);
const dataLoadable = loadable(dataAtom);

export default function ExploreSectionListingView({
  title,
  enableDownload,
}: ExploreSectionPageProps) {
  const [openFiltersSidebar, setOpenFiltersSidebar] = useState(false);
  const columnKeys = useAtomValue(columnKeysAtom);
  const [sortState, setSortState] = useAtom(sortStateAtom);
  const [activeColumns, setActiveColumns] = useAtom(activeColumnsAtom);
  const filters = useAtomValue(filtersAtom);
  const [pageSize, setPageSize] = useAtom(pageSizeAtom);
  const initializeActiveColumns = useSetAtom(initializeActiveColumnsAtom);
  const initializeFilters = useSetAtom(initializeFiltersAtom);
  const total = useAtomValue(totalLoadable);
  const data = useAtomValue(dataLoadable);

  useEffect(() => {
    initializeActiveColumns();
    initializeFilters();
  }, [initializeActiveColumns, initializeFilters, columnKeys]);

  const onLoadMore = () => {
    setPageSize(pageSize + 30);
  };

  const renderTotal = () => {
    if (total.state === 'loading') {
      return <Spin className="ml-3" indicator={<LoadingOutlined />} />;
    }
    if (total.state === 'hasData' && total.data?.value) {
      return Number(total.data.value).toLocaleString('en-US');
    }
    return 0;
  };

  const onToggleActive = useCallback(
    (key: string) => {
      const existingIndex = activeColumns.findIndex((existingKey) => existingKey === key);

      return existingIndex === -1
        ? setActiveColumns([...activeColumns, key])
        : setActiveColumns([
            ...activeColumns.slice(0, existingIndex),
            ...activeColumns.slice(existingIndex + 1),
          ]);
    },
    [activeColumns, setActiveColumns]
  );

  const selectedFiltersCount = filters.filter((filter) => filterHasValue(filter)).length;
  const activeColumnsLength = activeColumns.length ? activeColumns.length - 1 : 0;
  const activeColumnsText = `${activeColumnsLength} active ${
    activeColumnsLength === 1 ? 'column' : 'columns'
  }`;

  const columns = useExploreColumns(columnKeys, setSortState, sortState);

  return (
    <>
      <section className="w-full h-screen flex flex-col gap-5 bg-white pt-8 pl-7 pr-3 overflow-scroll relative">
        <div className="flex items-center justify-between ml-5">
          <div className="text-primary-7 text-2xl font-bold flex-auto w-6/12">
            {title}
            <span className="text-sm whitespace-pre font-thin text-slate-400 pl-2">
              Total: {renderTotal()}
            </span>
          </div>

          <div className="flex items-center gap-5 justify-between w-auto">
            <ClearFilters />
            <ExploreSectionNameSearch />
            {!openFiltersSidebar && (
              <button
                type="button"
                className={styles.filterButton}
                onClick={() => setOpenFiltersSidebar(!openFiltersSidebar)}
              >
                <span className="bg-primary-1 text-primary-9 text-sm font-medium px-2.5 py-1 rounded dark:bg-primary-1 dark:text-primary-9">
                  {selectedFiltersCount}
                </span>
                <span>Filters</span>
                <span className={styles.active}>{activeColumnsText}</span>
                <span>
                  <SettingsIcon className="rotate-90" />
                </span>
              </button>
            )}
          </div>
        </div>
        <ExploreSectionTable
          columns={columns.filter(({ key }) => activeColumns.includes(key as string))}
          enableDownload={enableDownload}
          data={data}
        />
        <LoadMoreButton
          onClick={onLoadMore}
          allLoaded={
            data.state === 'hasData' &&
            total.state === 'hasData' &&
            total.data?.value === data.data?.length
          }
          isLoading={data.state === 'loading'}
        />
      </section>
      {openFiltersSidebar && (
        <ControlPanel
          activeColumns={activeColumns}
          onToggleActive={onToggleActive}
          setOpen={setOpenFiltersSidebar}
        />
      )}
    </>
  );
}
