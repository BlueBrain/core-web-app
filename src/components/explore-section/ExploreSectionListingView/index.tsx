import { HTMLProps, ReactNode, useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { loadable } from 'jotai/utils';
import { ExploreSectionResource } from '@/types/explore-section/resources';
import ExploreSectionNameSearch from '@/components/explore-section/ExploreSectionListingView/ExploreSectionNameSearch';
import ClearFilters from '@/components/explore-section/ExploreSectionListingView/ClearFilters';
import LoadMoreButton from '@/components/explore-section/ExploreSectionListingView/LoadMoreButton';
import ExploreSectionTable from '@/components/explore-section/ExploreSectionListingView/ExploreSectionTable';
import ListTable from '@/components/ListTable';
import ControlPanel from '@/components/explore-section/ControlPanel';
import SettingsIcon from '@/components/icons/Settings';
import { filterHasValue } from '@/components/Filter/util';
import useExploreColumns from '@/hooks/useExploreColumns';
import {
  activeColumnsAtom,
  dataAtom,
  filtersAtom,
  totalAtom,
} from '@/state/explore-section/list-view-atoms';

function FilterBtn({ onClick }: HTMLProps<HTMLButtonElement>) {
  const activeColumns = useAtomValue(activeColumnsAtom);
  const filters = useAtomValue(filtersAtom);

  const activeColumnsLength = activeColumns.length ? activeColumns.length - 1 : 0;
  const activeColumnsText = `${activeColumnsLength} active ${
    activeColumnsLength === 1 ? 'column' : 'columns'
  }`;

  const selectedFiltersCount = filters.filter((filter) => filterHasValue(filter)).length;

  return (
    <button
      className="bg-primary-8 flex gap-10 items-center justify-between max-h-[56px] rounded-md p-5"
      onClick={onClick}
      type="button"
    >
      <div className="flex gap-3 items-center">
        <span className="bg-primary-1 text-primary-9 text-sm font-medium px-2.5 py-1 rounded dark:bg-primary-1 dark:text-primary-9">
          {selectedFiltersCount}
        </span>
        <span className="font-bold text-white">Filters</span>
        <span className="text-primary-3 text-sm">{activeColumnsText}</span>
      </div>
      <SettingsIcon className="rotate-90 text-white" />
    </button>
  );
}

const totalLoadable = loadable(totalAtom);

function Header({ title }: { title: string }) {
  const data = useAtomValue(totalLoadable);

  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    if (data.state === 'hasData' && data.data) {
      setTotal(data.data.value);
    }
  }, [data]);

  return (
    <div className="text-primary-7 text-2xl font-bold flex-auto w-6/12">
      {title}
      <span className="text-sm whitespace-pre font-thin text-slate-400 pl-2">
        Total:{' '}
        {total?.toLocaleString('en-US') ?? (
          <Spin className="ml-3" indicator={<LoadingOutlined />} />
        )}
      </span>
    </div>
  );
}

function ExploreSectionListingView({ title, children }: { title: string; children: ReactNode }) {
  const [displayControlPanel, setDisplayControlPanel] = useState(false);

  return (
    <>
      <section className="w-full h-screen flex flex-col gap-5 bg-white pb-12 pl-7 pr-3 pt-8 overflow-scroll relative">
        <div className="flex items-center justify-between ml-5">
          <Header title={title} />
          <div className="flex items-center gap-5 justify-between w-auto">
            <ClearFilters />
            <ExploreSectionNameSearch />
            <FilterBtn onClick={() => setDisplayControlPanel(!displayControlPanel)} />
          </div>
        </div>
        {children}
        <LoadMoreButton />
      </section>
      {displayControlPanel && <ControlPanel toggleDisplay={() => setDisplayControlPanel(false)} />}
    </>
  );
}

const dataLoadable = loadable(dataAtom);

export default function DefaultListView({
  title,
  enableDownload,
}: {
  title: string;
  enableDownload?: boolean;
}) {
  const columns = useExploreColumns([
    {
      title: '#',
      key: 'index',
      className: 'text-primary-7',
      render: (_text: string, _record: ExploreSectionResource, index: number) => index + 1,
      width: 70,
    },
  ]);

  const activeColumns = useAtomValue(activeColumnsAtom);
  const data = useAtomValue(dataLoadable);

  return (
    <ExploreSectionListingView title={title}>
      <ExploreSectionTable
        columns={columns.filter(({ key }) => activeColumns.includes(key as string))}
        enableDownload={enableDownload}
        data={data}
      />
    </ExploreSectionListingView>
  );
}

export function SimulationCampaignView({ title }: { title: string }) {
  const columns = useExploreColumns();

  const activeColumns = useAtomValue(activeColumnsAtom);
  const data = useAtomValue(dataLoadable);

  return (
    <ExploreSectionListingView title={title}>
      <ListTable
        columns={columns.filter(({ key }) => activeColumns.includes(key as string))}
        data={data} // Add a "key" for each row.
      />
    </ExploreSectionListingView>
  );
}
