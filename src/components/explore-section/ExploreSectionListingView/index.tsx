import { Dispatch, ReactNode, SetStateAction, useMemo, useState, useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { loadable, unwrap } from 'jotai/utils';
import { Tabs } from 'antd';
import HeaderPanel from './HeaderPanel';
import FilterControls from './FilterControls';
import { ExploreResource } from '@/types/explore-section/es';
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
  dimensionColumnsAtom,
} from '@/state/explore-section/list-view-atoms';
import { RenderButtonProps } from '@/components/explore-section/ExploreSectionListingView/WithRowSelection';
import { inferredResourceIdsAtom } from '@/state/explore-section/generalization';

function WithControlPanel({
  children,
  loading,
  experimentTypeName,
}: {
  children: ({
    displayControlPanel,
    setDisplayControlPanel,
  }: {
    displayControlPanel: boolean;
    setDisplayControlPanel: Dispatch<SetStateAction<boolean>>;
  }) => ReactNode;
  loading: boolean;
  experimentTypeName: string;
}) {
  const total = useAtomValue(
    useMemo(() => unwrap(totalAtom({ experimentTypeName })), [experimentTypeName])
  );

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
          experimentTypeName={experimentTypeName}
        />
      )}
    </>
  );
}

export default function DefaultListViewTabs({
  enableDownload,
  title,
  experimentTypeName,
  renderButton,
}: {
  enableDownload?: boolean;
  title: string;
  experimentTypeName: string;
  renderButton?: (props: RenderButtonProps) => ReactNode;
}) {
  const inferredResourceIds = useAtomValue(inferredResourceIdsAtom(experimentTypeName));

  // Convert inferredResourceIds to an array
  const inferredResourceIdsArray = Array.from(inferredResourceIds);

  // Use state to manage the items array
  const [items, setItems] = useState<Array<{ label: string; key: string; children: ReactNode }>>([
    {
      key: experimentTypeName,
      label: 'Original',
      children: (
        <DefaultListView
          enableDownload={enableDownload}
          title={title}
          experimentTypeName={experimentTypeName}
          renderButton={renderButton}
        />
      ),
    },
  ]);

  useEffect(() => {
    // Create a new array with the original item and additional items
    const newItems = [
      {
        key: experimentTypeName,
        label: 'Original',
        children: (
          <DefaultListView
            enableDownload={enableDownload}
            title={title}
            experimentTypeName={experimentTypeName}
            renderButton={renderButton}
          />
        ),
      },
      ...inferredResourceIdsArray.map((v1) => ({
        key: v1 as string,
        label: v1 as string,
        children: (
          <DefaultListView
            enableDownload={enableDownload}
            title={title}
            experimentTypeName={experimentTypeName}
            resourceId={v1 as string}
            renderButton={renderButton}
          />
        ),
      })),
    ];

    // Update the items array
    setItems(newItems);
  }, [inferredResourceIdsArray, experimentTypeName, title, enableDownload, renderButton]);

  return (
    <div className="p-0 m-0">
      <Tabs items={items} />
    </div>
  );
}

export function DefaultListView({
  enableDownload,
  title,
  experimentTypeName,
  resourceId,
  renderButton,
}: {
  enableDownload?: boolean;
  title: string;
  experimentTypeName: string;
  resourceId?: string;
  renderButton?: (props: RenderButtonProps) => ReactNode;
}) {
  const activeColumns = useAtomValue(activeColumnsAtom({ experimentTypeName }));
  const scopedDataAtom = dataAtom({ experimentTypeName, resourceId });
  const data = useAtomValue(useMemo(() => loadable(scopedDataAtom), [scopedDataAtom]));
  const unwrappedData = useAtomValue(
    useMemo(() => unwrap(scopedDataAtom, (prev) => prev ?? []), [scopedDataAtom])
  );
  const [sortState, setSortState] = useAtom(sortStateAtom);

  const columns = useExploreColumns(setSortState, sortState, [
    {
      title: '#',
      key: 'index',
      className: 'text-primary-7',
      render: (_text: string, _record: ExploreResource, index: number) => index + 1,
      width: 70,
    },
  ]);

  const loading = data.state === 'loading' || !activeColumns;
  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <WithControlPanel loading={loading} experimentTypeName={experimentTypeName}>
        {({ displayControlPanel, setDisplayControlPanel }) => (
          <>
            <HeaderPanel
              loading={loading}
              title={title}
              experimentTypeName={experimentTypeName}
              resourceId={resourceId}
            >
              <FilterControls
                displayControlPanel={displayControlPanel}
                setDisplayControlPanel={setDisplayControlPanel}
                experimentTypeName={experimentTypeName}
              />
            </HeaderPanel>
            <ExploreSectionTable
              columns={columns.filter(({ key }) => (activeColumns || []).includes(key as string))}
              dataSource={unwrappedData}
              loading={data.state === 'loading'}
              enableDownload={enableDownload}
              experimentTypeName={experimentTypeName}
              hasError={data.state === 'hasError'}
              renderButton={renderButton}
            />
          </>
        )}
      </WithControlPanel>
    </div>
  );
}

export function SimulationCampaignView({
  title,
  experimentTypeName,
}: {
  title: string;
  experimentTypeName: string;
}) {
  const activeColumns = useAtomValue(
    useMemo(() => unwrap(activeColumnsAtom({ experimentTypeName })), [experimentTypeName])
  );
  const scopedDataAtom = dataAtom({ experimentTypeName });
  const data = useAtomValue(useMemo(() => loadable(scopedDataAtom), [scopedDataAtom]));
  const unwrappedData = useAtomValue(
    useMemo(() => unwrap(scopedDataAtom, (prev) => prev ?? []), [scopedDataAtom])
  );

  const dimensionColumns = useAtomValue(
    useMemo(() => unwrap(dimensionColumnsAtom({ experimentTypeName })), [experimentTypeName])
  );

  const columns = useExploreColumns(setSortState, sortState, [], dimensionColumns);

  const loading = data.state === 'loading' || !dimensionColumns;

  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <WithControlPanel loading={loading} experimentTypeName={experimentTypeName}>
        {({ displayControlPanel, setDisplayControlPanel }) => (
          <>
            <HeaderPanel loading={loading} title={title} experimentTypeName={experimentTypeName}>
              <FilterControls
                displayControlPanel={displayControlPanel}
                setDisplayControlPanel={setDisplayControlPanel}
                experimentTypeName={experimentTypeName}
              />
            </HeaderPanel>
            <ListTable
              columns={columns.filter(({ key }) => (activeColumns || []).includes(key as string))}
              dataSource={unwrappedData}
              loading={loading}
            />
          </>
        )}
      </WithControlPanel>
    </div>
  );
}
