import { ColumnProps } from 'antd/es/table';
import { Atom, PrimitiveAtom, useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { useMemo } from 'react';
import ObservatoryNameSearch from '@/components/observatory/ephys/ObservatoryNameSearch';
import LoadMoreButton from '@/components/ObservatoryListingView/LoadMoreButton';
import ObservatoryTable from '@/components/ObservatoryListingView/ObservatoryTable';
import ControlPanel from '@/components/observatory/Filters';
import { Filter } from '@/components/Filter/types';
import { EphysResource, ObservatoryResource } from '@/types/observatory';

type ObservatoryPageProps = {
  title: string;
  dataAtom: Atom<Promise<ObservatoryResource[] | EphysResource[] | undefined>>;
  searchStringAtom: PrimitiveAtom<string>;
  pageSizeAtom: PrimitiveAtom<number>;
  columns: ColumnProps<any>[];
  aggregationsAtom: Atom<Promise<any>>;
  filtersAtom: PrimitiveAtom<Filter[]>;
};

export default function ObservatoryListingView({
  title,
  dataAtom,
  columns,
  searchStringAtom,
  pageSizeAtom,
  aggregationsAtom,
  filtersAtom,
}: ObservatoryPageProps) {
  const loadableData = useMemo(() => loadable(dataAtom), [dataAtom]);
  const data = useAtomValue(loadableData);

  return (
    <>
      <section className="w-full">
        <div className="flex py-8">
          <div className="ml-10 text-primary-7 text-2xl font-bold flex-auto w-10/12">{title}</div>
          <div className="mr-10">
            <ObservatoryNameSearch searchStringAtom={searchStringAtom} />
          </div>
        </div>
        <div
          className="bg-white w-full h-80 overflow-scroll"
          style={{ height: 'calc(100vh - 100px)' }}
        >
          <ObservatoryTable loadableData={data} columns={columns} />
          <LoadMoreButton isLoadedState={data.state} pageSizeAtom={pageSizeAtom} />
        </div>
      </section>
      <ControlPanel aggregationsAtom={aggregationsAtom} filtersAtom={filtersAtom} />
    </>
  );
}
