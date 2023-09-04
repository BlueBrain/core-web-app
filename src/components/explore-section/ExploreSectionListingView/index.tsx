import { Dispatch, ReactNode, SetStateAction, useMemo, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { loadable, unwrap } from 'jotai/utils';
import HeaderPanel from './HeaderPanel';
import FilterControls from './FilterControls';
import { ExploreSectionResource } from '@/types/explore-section/resources';
import LoadMoreButton from '@/components/explore-section/ExploreSectionListingView/LoadMoreButton';
import ExploreSectionTable from '@/components/explore-section/ExploreSectionListingView/ExploreSectionTable';
import ListTable from '@/components/ListTable';
import ControlPanel from '@/components/explore-section/ControlPanel';
import useExploreColumns from '@/hooks/useExploreColumns';
import {
  activeColumnsAtom,
  dataAtom,
  totalAtom,
  sortStateAtom,
  pageSizeAtom,
} from '@/state/explore-section/list-view-atoms';

function WithControlPanel({
  children,
  loading,
  type,
}: {
  children: ({
    displayControlPanel,
    setDisplayControlPanel,
  }: {
    displayControlPanel: boolean;
    setDisplayControlPanel: Dispatch<SetStateAction<boolean>>;
  }) => ReactNode;
  loading: boolean;
  type: string;
}) {
  const total = useAtomValue(useMemo(() => unwrap(totalAtom(type)), [type]));

  const [pageSize, setPageSize] = useAtom(pageSizeAtom);

  const [displayControlPanel, setDisplayControlPanel] = useState(false);

  return (
    <>
      <section className="w-full h-screen flex flex-col gap-5 bg-white pb-12 pl-7 pr-3 pt-8 overflow-scroll relative">
        {children({ displayControlPanel, setDisplayControlPanel })}
        <LoadMoreButton
          disabled={!!total && pageSize > total}
          loading={loading}
          onClick={() => setPageSize(pageSize + 30)}
        >
          {!!total && pageSize < total ? 'Load 30 more results...' : 'All resources are loaded'}
        </LoadMoreButton>
      </section>
      {displayControlPanel && (
        <ControlPanel
          toggleDisplay={() => setDisplayControlPanel(false)}
          experimentTypeName={type}
        />
      )}
    </>
  );
}

export default function DefaultListView({
  enableDownload,
  selectedRowsButton,
  title,
  type,
}: {
  enableDownload?: boolean;
  selectedRowsButton?: ReactNode;
  title: string;
  type: string;
}) {
  const activeColumns = useAtomValue(activeColumnsAtom(type));
  const data = useAtomValue(useMemo(() => loadable(dataAtom(type)), [type]));
  const [sortState, setSortState] = useAtom(sortStateAtom);

  const columns = useExploreColumns(setSortState, sortState, [
    {
      title: '#',
      key: 'index',
      className: 'text-primary-7',
      render: (_text: string, _record: ExploreSectionResource, index: number) => index + 1,
      width: 70,
    },
  ]);

  const loading = data.state === 'loading';

  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <WithControlPanel loading={loading} type={type}>
        {({ displayControlPanel, setDisplayControlPanel }) => (
          <>
            <HeaderPanel loading={loading} title={title} type={type}>
              <FilterControls
                displayControlPanel={displayControlPanel}
                setDisplayControlPanel={setDisplayControlPanel}
                type={type}
              />
            </HeaderPanel>
            <ExploreSectionTable
              columns={columns.filter(({ key }) => activeColumns.includes(key as string))}
              data={data}
              enableDownload={enableDownload}
              selectedRowsButton={selectedRowsButton}
              type={type}
            />
          </>
        )}
      </WithControlPanel>
    </div>
  );
}

export function SimulationCampaignView({ title, type }: { title: string; type: string }) {
  const activeColumns = useAtomValue(activeColumnsAtom(type));
  const data = useAtomValue(useMemo(() => loadable(dataAtom(type)), [type]));
  const [sortState, setSortState] = useAtom(sortStateAtom);

  const columns = useExploreColumns(setSortState, sortState);

  const loading = data.state === 'loading';

  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <WithControlPanel loading={loading} type={type}>
        {({ displayControlPanel, setDisplayControlPanel }) => (
          <>
            <HeaderPanel loading={loading} title={title} type={type}>
              <FilterControls
                displayControlPanel={displayControlPanel}
                setDisplayControlPanel={setDisplayControlPanel}
                type={type}
              />
            </HeaderPanel>
            <ListTable
              columns={columns.filter(({ key }) => activeColumns.includes(key as string))}
              data={data}
            />
          </>
        )}
      </WithControlPanel>
    </div>
  );
}
