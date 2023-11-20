import { ReactNode, useState, useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import { InsertRowAboveOutlined, UnorderedListOutlined } from '@ant-design/icons';
import FilterControls from './FilterControls';
import { RenderButtonProps } from './WithRowSelection';
import { ExploreResource } from '@/types/explore-section/es';
import ExploreSectionTable from '@/components/explore-section/ExploreSectionListingView/ExploreSectionTable';
import WithControlPanel from '@/components/explore-section/ExploreSectionListingView/WithControlPanel';
import HeaderPanel from '@/components/explore-section/ExploreSectionListingView/HeaderPanel';
import useExploreColumns from '@/hooks/useExploreColumns';
import { sortStateAtom, dataAtom } from '@/state/explore-section/list-view-atoms';
import CardView from '@/components/explore-section/CardView';
import { ExploreDataBrainRegionSource } from '@/types/explore-section/application';

type ViewMode = 'table' | 'card';

export default function DefaultListView({
  enableDownload,
  experimentTypeName,
  title,
  brainRegionSource,
  renderButton,
}: {
  enableDownload?: boolean;
  experimentTypeName: string;
  title: string;
  brainRegionSource: ExploreDataBrainRegionSource;
  renderButton?: (props: RenderButtonProps) => ReactNode;
}) {
  const [sortState, setSortState] = useAtom(sortStateAtom);
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const columns = useExploreColumns(
    setSortState,
    sortState,
    [
      {
        title: '#',
        key: 'index',
        className: 'text-primary-7',
        render: (_text: string, _record: ExploreResource, index: number) => index + 1,
        width: 70,
      },
    ],
    null,
    experimentTypeName
  );

  const data = useAtomValue(
    useMemo(
      () =>
        unwrap(
          dataAtom({
            experimentTypeName,
            brainRegionSource,
          })
        ),
      [brainRegionSource, experimentTypeName]
    )
  );

  return (
    <div
      className="min-h-screen"
      style={{ background: '#d1d1d1' }}
      data-testid="explore-section-listing-view"
    >
      <WithControlPanel
        experimentTypeName={experimentTypeName}
        brainRegionSource={brainRegionSource}
      >
        {({ activeColumns, displayControlPanel, setDisplayControlPanel, filters }) => (
          <>
            <FilterControls
              filters={filters}
              displayControlPanel={displayControlPanel}
              experimentTypeName={experimentTypeName}
              setDisplayControlPanel={setDisplayControlPanel}
            >
              <HeaderPanel
                experimentTypeName={experimentTypeName}
                title={title}
                brainRegionSource={brainRegionSource}
              />
            </FilterControls>
            <div className="flex gap-2 place-content-end  items-center ">
              <div className="text-primary-7">View:</div>
              <button
                onClick={() => setViewMode('table')}
                type="button"
                aria-label="Set table mode"
              >
                <UnorderedListOutlined
                  className={
                    viewMode === 'table' ? 'bg-primary-7 p-1 text-neutral-1' : 'text-neutral-3 p-1'
                  }
                />
              </button>
              <button
                onClick={() => setViewMode('card')}
                type="button"
                aria-label="card-view-button"
              >
                <InsertRowAboveOutlined
                  className={
                    viewMode === 'card' ? 'bg-primary-7 p-1 text-neutral-1' : 'text-neutral-3 p-1'
                  }
                />
              </button>
            </div>
            {viewMode === 'table' ? (
              <ExploreSectionTable
                columns={columns.filter(({ key }) => (activeColumns || []).includes(key as string))}
                dataSource={data}
                enableDownload={enableDownload}
                experimentTypeName={experimentTypeName}
                loading={!data}
                renderButton={renderButton}
              />
            ) : (
              <CardView data={data} experimentTypeName={experimentTypeName} />
            )}
          </>
        )}
      </WithControlPanel>
    </div>
  );
}
