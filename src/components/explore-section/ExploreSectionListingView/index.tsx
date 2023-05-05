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
  enableDownload?: boolean;
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
  enableDownload,
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
      <section className="w-full h-screen flex flex-col gap-5 bg-white pt-8 pb-12 pl-10 pr-16 overflow-scroll relative">
        <div className="flex items-center justify-between">
          <div className="text-primary-7 text-2xl font-bold flex-auto w-10/12">
            {title}
            <span className="text-sm whitespace-pre font-thin text-slate-400 pl-2">
              Total: {value}
            </span>
          </div>

          <div className="flex items-center gap-5 justify-between">
            <ExploreSectionNameSearch searchStringAtom={searchStringAtom} />
            {!openFiltersSidebar && (
              <button
                type="button"
                className={styles.filterButton}
                onClick={() => setOpenFiltersSidebar(!openFiltersSidebar)}
              >
                <span className="bg-primary-1 text-primary-9 text-sm font-medium px-2.5 py-1 rounded dark:bg-primary-1 dark:text-primary-9">
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
        <ExploreSectionTable
          loadableData={data}
          columns={columns}
          enableDownload={enableDownload}
        />
        <LoadMoreButton dataState={data} pageSizeAtom={pageSizeAtom} totalState={total} />
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
