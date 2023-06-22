import { ColumnProps } from 'antd/es/table';
import { Dispatch, useState } from 'react';
import { SetStateAction } from 'jotai';
import ExploreSectionNameSearch from '@/components/explore-section/EphysViewerContainer/ExploreSectionNameSearch';
import LoadMoreButton from '@/components/explore-section/ExploreSectionListingView/LoadMoreButton';
import ExploreSectionTable from '@/components/explore-section/ExploreSectionListingView/ExploreSectionTable';
import ControlPanel from '@/components/explore-section/ControlPanel';
import { formatNumber } from '@/util/common';
import { ListViewAtomValues } from '@/types/explore-section/application';
import SettingsIcon from '@/components/icons/Settings';
import { Filter } from '@/components/Filter/types';
import { filterHasValue } from '@/components/Filter/util';
import styles from '@/components/explore-section/ControlPanel/filters.module.scss';

type ExploreSectionPageProps = {
  atomValues: ListViewAtomValues;
  columns: ColumnProps<any>[];
  onLoadMore: () => void;
  setFilters: Dispatch<SetStateAction<Filter[]>>;
  setSearchString: Dispatch<SetStateAction<string>>;
  title: string;
  enableDownload?: boolean;
};

export default function ExploreSectionListingView({
  atomValues,
  columns,
  onLoadMore,
  setFilters,
  setSearchString,
  title,
  enableDownload,
}: ExploreSectionPageProps) {
  const [openFiltersSidebar, setOpenFiltersSidebar] = useState(false);
  const { aggregations, data, filters, searchString, total } = atomValues;

  const value =
    total.state === 'hasData' && total.data?.value ? formatNumber(total.data?.value) : 0;

  const selectedFiltersCount = filters.filter((filter) => filterHasValue(filter)).length;

  return (
    <>
      <section className="w-full h-screen flex flex-col gap-5 bg-white pt-8 pb-12 pl-7 pr-16 overflow-scroll relative">
        <div className="flex items-center justify-between">
          <div className="text-primary-7 text-2xl font-bold flex-auto w-10/12">
            {title}
            <span className="text-sm whitespace-pre font-thin text-slate-400 pl-2">
              Total: {value}
            </span>
          </div>

          <div className="flex items-center gap-5 justify-between">
            <ExploreSectionNameSearch
              searchString={searchString}
              setSearchString={setSearchString}
            />
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
                <span className={styles.active}> 6 active columns</span>
                <span>
                  <SettingsIcon className="rotate-90" />
                </span>
              </button>
            )}
          </div>
        </div>
        <ExploreSectionTable columns={columns} enableDownload={enableDownload} data={data} />
        <LoadMoreButton data={data} onClick={onLoadMore} total={total} />
      </section>
      {openFiltersSidebar && (
        <ControlPanel
          aggregations={aggregations}
          filters={filters}
          setFilters={setFilters}
          setOpen={setOpenFiltersSidebar}
        />
      )}
    </>
  );
}
