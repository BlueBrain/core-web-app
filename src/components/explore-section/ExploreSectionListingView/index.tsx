import { ReactNode, useEffect, useState, useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { InsertRowAboveOutlined, UnorderedListOutlined } from '@ant-design/icons';
import FilterControls from './FilterControls';
import { RenderButtonProps } from './WithRowSelection';
import { ExploreESHit } from '@/types/explore-section/es';
import ExploreSectionTable from '@/components/explore-section/ExploreSectionListingView/ExploreSectionTable';
import WithControlPanel from '@/components/explore-section/ExploreSectionListingView/WithControlPanel';
import NumericResultsInfo from '@/components/explore-section/ExploreSectionListingView/NumericResultsInfo';
import useExploreColumns from '@/hooks/useExploreColumns';
import { sortStateAtom, dataAtom } from '@/state/explore-section/list-view-atoms';
import CardView from '@/components/explore-section/CardView';
import { ExploreDataBrainRegionSource } from '@/types/explore-section/application';

type ViewMode = 'table' | 'card';

export default function DefaultListView({
  enableDownload,
  experimentTypeName,
  brainRegionSource,
  renderButton,
}: {
  enableDownload?: boolean;
  experimentTypeName: string;
  brainRegionSource: ExploreDataBrainRegionSource;
  renderButton?: (props: RenderButtonProps) => ReactNode;
}) {
  const [sortState, setSortState] = useAtom(sortStateAtom);
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const columns = useExploreColumns(setSortState, sortState, [], null, experimentTypeName);

  const data = useAtomValue(
    useMemo(
      () =>
        loadable(
          dataAtom({
            experimentTypeName,
            brainRegionSource,
          })
        ),
      [brainRegionSource, experimentTypeName]
    )
  );

  const [dataSource, setDataSource] = useState<ExploreESHit[]>();

  useEffect(() => {
    if (data.state === 'hasData') {
      setDataSource(data.data);
    }
  }, [data, setDataSource]);

  return (
    <div style={{ background: '#d1d1d1' }} data-testid="explore-section-listing-view">
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
              <NumericResultsInfo
                experimentTypeName={experimentTypeName}
                brainRegionSource={brainRegionSource}
              />
            </FilterControls>
            <div className="flex gap-2 place-content-end items-center">
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
                dataSource={dataSource}
                enableDownload={enableDownload}
                experimentTypeName={experimentTypeName}
                loading={data.state === 'loading'}
                renderButton={renderButton}
              />
            ) : (
              <CardView data={dataSource} experimentTypeName={experimentTypeName} />
            )}
          </>
        )}
      </WithControlPanel>
    </div>
  );
}
