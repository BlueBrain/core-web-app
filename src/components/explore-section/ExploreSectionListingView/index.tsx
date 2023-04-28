import { ColumnProps } from 'antd/es/table';
import { Atom, PrimitiveAtom, useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { useMemo, useState } from 'react';
import ExploreSectionNameSearch from '@/components/explore-section/EphysViewerContainer/ExploreSectionNameSearch';
import LoadMoreButton from '@/components/explore-section/ExploreSectionListingView/LoadMoreButton';
import ExploreSectionTable from '@/components/explore-section/ExploreSectionListingView/ExploreSectionTable';
import ControlPanel from '@/components/explore-section/ControlPanel';
import { Filter } from '@/components/Filter/types';
import { ExploreSectionResource, TotalHits } from '@/types/explore-section';
import { formatNumber } from '@/util/common';

import SettingsIcon from '@/components/icons/Settings';

import styles from '@/components/explore-section/ControlPanel/filters.module.scss';

type ExploreSectionPageProps = {
  title: string;
  totalAtom: Atom<Promise<TotalHits | undefined>>;
  dataAtom: Atom<Promise<ExploreSectionResource[] | undefined>>;
  searchStringAtom: PrimitiveAtom<string>;
  pageSizeAtom: PrimitiveAtom<number>;
  columns: ColumnProps<any>[];
  aggregationsAtom: Atom<Promise<any>>;
  filtersAtom: PrimitiveAtom<Filter[]>;
};

export default function ExploreSectionListingView({
  title,
  totalAtom,
  dataAtom,
  columns,
  searchStringAtom,
  pageSizeAtom,
  aggregationsAtom,
  filtersAtom,
}: ExploreSectionPageProps) {
  const [openFiltersSidebar, setOpenFiltersSidebar] = useState(false);
  const loadableData = useMemo(() => loadable(dataAtom), [dataAtom]);
  const loadableTotal = useMemo(() => loadable(totalAtom), [totalAtom]);
  const data = useAtomValue(loadableData);
  const total = useAtomValue(loadableTotal);
  const value =
    total.state === 'hasData' && total.data?.value ? formatNumber(total.data?.value) : 0;

  return (
    <>
      <section className="w-full bg-white">
        <div className="flex items-center py-8">
          <div className="ml-10 text-primary-7 text-2xl font-bold flex-auto">
            {title}
            <span className="text-sm whitespace-pre font-thin text-slate-400 pl-2">
              Total: {value}
            </span>
          </div>
          <div className="mr-5 flex items-center space-between">
            <ExploreSectionNameSearch searchStringAtom={searchStringAtom} />
          </div>
          <div className="mr-5">
            {!openFiltersSidebar && (
              <button
                type="button"
                className={styles.filterButton}
                onClick={() => setOpenFiltersSidebar(!openFiltersSidebar)}
              >
                <span className="bg-primary-1 text-primary-1 text-sm font-medium px-2.5 py-1 rounded dark:bg-primary-1 dark:text-primary-9">
                  0
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
        <div
          className="bg-white w-full h-80 overflow-scroll"
          style={{ height: 'calc(100vh - 100px)' }}
        >
          <ExploreSectionTable loadableData={data} columns={columns} />
          <LoadMoreButton dataState={data} pageSizeAtom={pageSizeAtom} totalState={total} />
        </div>
      </section>
      {openFiltersSidebar && (
        <ControlPanel
          aggregationsAtom={aggregationsAtom}
          filtersAtom={filtersAtom}
          setOpen={setOpenFiltersSidebar}
        />
      )}
    </>
  );
}
