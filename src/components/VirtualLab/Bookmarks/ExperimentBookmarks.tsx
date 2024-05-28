import { useAtom, useAtomValue } from 'jotai';

import { loadable } from 'jotai/utils';
import { useMemo } from 'react';
import ExploreSectionTable from '@/components/explore-section/ExploreSectionListingView/ExploreSectionTable';
import FilterControls from '@/components/explore-section/ExploreSectionListingView/FilterControls';
import NumericResultsInfo from '@/components/explore-section/ExploreSectionListingView/NumericResultsInfo';
import WithControlPanel from '@/components/explore-section/ExploreSectionListingView/WithControlPanel';
import { DataType } from '@/constants/explore-section/list-views';
import useExploreColumns from '@/hooks/useExploreColumns';
import { dataAtom, sortStateAtom } from '@/state/explore-section/list-view-atoms';

type Props = {
  dataType: DataType;
  resourceIds: string[];
};

export default function ExperimentBookmarks({ dataType, resourceIds }: Props) {
  const [sortState, setSortState] = useAtom(sortStateAtom);
  const columns = useExploreColumns(setSortState, sortState, [], null, dataType);

  const data = useAtomValue(
    useMemo(
      () =>
        loadable(
          dataAtom({
            dataType,
            brainRegionSource: 'selected',
            bookmarkResourceIds: resourceIds,
          })
        ),
      [dataType, resourceIds]
    )
  );

  const dataSource = data.state === 'hasData' ? data.data : [];

  return (
    <div
      id="bookmark-list-container"
      style={{
        height: `${dataSource.length * 100}px`,
        maxHeight: '700px',
        position: 'relative',
        minHeight: '450px',
      }}
    >
      <div className="grid w-full grid-cols-[auto_max-content] grid-rows-1 overflow-x-auto">
        <WithControlPanel
          dataType={dataType}
          brainRegionSource="selected"
          bookmarkResourceIds={resourceIds}
        >
          {({ activeColumns, displayControlPanel, setDisplayControlPanel, filters }) => (
            <>
              <FilterControls
                filters={filters}
                displayControlPanel={displayControlPanel}
                dataType={dataType}
                setDisplayControlPanel={setDisplayControlPanel}
                className="sticky top-0 !max-h-24 px-4 py-5"
              >
                <NumericResultsInfo
                  dataType={dataType}
                  brainRegionSource="selected"
                  bookmarkResourceIds={resourceIds}
                />
              </FilterControls>
              <div>
                <ExploreSectionTable
                  columns={columns.filter(({ key }) =>
                    (activeColumns || []).includes(key as string)
                  )}
                  dataSource={dataSource}
                  enableDownload
                  dataType={dataType}
                  brainRegionSource="selected"
                  loading={data.state === 'loading'}
                  bookmarkResourceIds={resourceIds}
                />
              </div>
            </>
          )}
        </WithControlPanel>
      </div>
    </div>
  );
}
