import { ReactNode, useEffect, useState, useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import FilterControls from './FilterControls';
import { RenderButtonProps } from './WithRowSelection';
import ListingScrollNavControl from './ListingScrollNavControl';
import { ExploreESHit } from '@/types/explore-section/es';
import ExploreSectionTable from '@/components/explore-section/ExploreSectionListingView/ExploreSectionTable';
import WithControlPanel from '@/components/explore-section/ExploreSectionListingView/WithControlPanel';
import NumericResultsInfo from '@/components/explore-section/ExploreSectionListingView/NumericResultsInfo';
import useExploreColumns from '@/hooks/useExploreColumns';
import { sortStateAtom, dataAtom } from '@/state/explore-section/list-view-atoms';
import { ExploreDataBrainRegionSource } from '@/types/explore-section/application';
import { DataType } from '@/constants/explore-section/list-views';

export default function DefaultListView({
  enableDownload,
  dataType,
  brainRegionSource,
  renderButton,
}: {
  enableDownload?: boolean;
  dataType: DataType;
  brainRegionSource: ExploreDataBrainRegionSource;
  renderButton?: (props: RenderButtonProps) => ReactNode;
}) {
  const [sortState, setSortState] = useAtom(sortStateAtom);

  const [dataSource, setDataSource] = useState<ExploreESHit[]>();
  const columns = useExploreColumns(setSortState, sortState, [], null, dataType);

  const data = useAtomValue(
    useMemo(
      () =>
        loadable(
          dataAtom({
            dataType,
            brainRegionSource,
          })
        ),
      [brainRegionSource, dataType]
    )
  );

  useEffect(() => {
    if (data.state === 'hasData') {
      setDataSource(data.data);
    }
  }, [data, setDataSource]);

  return (
    <div className="h-full bg-[#d1d1d1]" data-testid="explore-section-listing-view">
      <div className="relative grid grid-cols-[auto_max-content] grid-rows-1 w-full max-h-[calc(100vh-3.3rem)] h-full overflow-x-auto overflow-y-hidden">
        <WithControlPanel dataType={dataType} brainRegionSource={brainRegionSource}>
          {({ activeColumns, displayControlPanel, setDisplayControlPanel, filters }) => (
            <>
              <FilterControls
                filters={filters}
                displayControlPanel={displayControlPanel}
                dataType={dataType}
                setDisplayControlPanel={setDisplayControlPanel}
                className="sticky top-0 py-5 px-4 !max-h-24"
              >
                <NumericResultsInfo dataType={dataType} brainRegionSource={brainRegionSource} />
              </FilterControls>
              <ExploreSectionTable
                columns={columns.filter(({ key }) => (activeColumns || []).includes(key as string))}
                dataSource={dataSource}
                enableDownload={enableDownload}
                dataType={dataType}
                brainRegionSource={brainRegionSource}
                loading={data.state === 'loading'}
                renderButton={renderButton}
              />
              <ListingScrollNavControl<HTMLDivElement>
                extraRightSpace={displayControlPanel ? 480 : 0}
                extraLeftSpace={12}
                show={data.state !== 'loading' && Boolean(dataSource?.length)}
                element={document.querySelector('.ant-table-body') as HTMLDivElement}
              />
            </>
          )}
        </WithControlPanel>
      </div>
    </div>
  );
}
