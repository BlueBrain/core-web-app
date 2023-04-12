import { ColumnProps } from 'antd/es/table';
import { Atom, PrimitiveAtom, useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { useMemo } from 'react';
import ExploreSectionNameSearch from '@/components/explore-section/ephys/ExploreSectionNameSearch';
import LoadMoreButton from '@/components/ExploreSectionListingView/LoadMoreButton';
import ExploreSectionTable from '@/components/ExploreSectionListingView/ExploreSectionTable';
import ControlPanel from '@/components/explore-section/Filters';
import { Filter } from '@/components/Filter/types';
import { EphysResource, ExploreSectionResource, TotalHits } from '@/types/explore-section';
import { formatNumber } from '@/util/common';

type ExploreSectionPageProps = {
  title: string;
  totalAtom: Atom<Promise<TotalHits | undefined>>;
  dataAtom: Atom<Promise<ExploreSectionResource[] | EphysResource[] | undefined>>;
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
  const loadableData = useMemo(() => loadable(dataAtom), [dataAtom]);
  const loadableTotal = useMemo(() => loadable(totalAtom), [totalAtom]);
  const data = useAtomValue(loadableData);
  const total = useAtomValue(loadableTotal);

  const value =
    total.state === 'hasData' && total.data?.value ? formatNumber(total.data?.value) : 0;

  return (
    <>
      <section className="w-full bg-white">
        <div className="flex py-8">
          <div className="ml-10 text-primary-7 text-2xl font-bold flex-auto w-10/12">
            {title}
            <span className="text-sm whitespace-pre font-thin text-slate-400 pl-2">
              Total: {value}
            </span>
          </div>
          <div className="mr-10">
            <ExploreSectionNameSearch searchStringAtom={searchStringAtom} />
          </div>
        </div>
        <div
          className="bg-white w-full h-80 overflow-scroll"
          style={{ height: 'calc(100vh - 100px)' }}
        >
          <ExploreSectionTable loadableData={data} columns={columns} />
          <LoadMoreButton isLoadedState={data.state} pageSizeAtom={pageSizeAtom} />
        </div>
      </section>
      <ControlPanel aggregationsAtom={aggregationsAtom} filtersAtom={filtersAtom} />
    </>
  );
}
