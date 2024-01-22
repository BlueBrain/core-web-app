import { ReactNode, useEffect, useState, useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import FilterControls from './FilterControls';
import { RenderButtonProps } from './WithRowSelection';
import { ExploreESHit } from '@/types/explore-section/es';
import ExploreSectionTable from '@/components/explore-section/ExploreSectionListingView/ExploreSectionTable';
import WithControlPanel from '@/components/explore-section/ExploreSectionListingView/WithControlPanel';
import NumericResultsInfo from '@/components/explore-section/ExploreSectionListingView/NumericResultsInfo';
import useExploreColumns from '@/hooks/useExploreColumns';
import { sortStateAtom, dataAtom } from '@/state/explore-section/list-view-atoms';
import { ExploreDataBrainRegionSource } from '@/types/explore-section/application';

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
    <div
      className="h-full"
      style={{ background: '#d1d1d1' }}
      data-testid="explore-section-listing-view"
    >
      <div className="grid grid-cols-[auto_max-content] grid-rows-1 w-full max-h-[calc(100vh-156px)] h-full overflow-x-auto overflow-y-hidden">
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
              <ExploreSectionTable
                columns={columns.filter(({ key }) => (activeColumns || []).includes(key as string))}
                dataSource={dataSource}
                enableDownload={enableDownload}
                experimentTypeName={experimentTypeName}
                loading={data.state === 'loading'}
                renderButton={renderButton}
              />
            </>
          )}
        </WithControlPanel>
      </div>
    </div>
  );
}
