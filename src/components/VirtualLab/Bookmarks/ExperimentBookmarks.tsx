import { useAtom, useAtomValue } from 'jotai';

import { loadable } from 'jotai/utils';
import { useRouter } from 'next/navigation';
import ExploreSectionTable from '@/components/explore-section/ExploreSectionListingView/ExploreSectionTable';
import FilterControls from '@/components/explore-section/ExploreSectionListingView/FilterControls';
import NumericResultsInfo from '@/components/explore-section/ExploreSectionListingView/NumericResultsInfo';
import WithControlPanel from '@/components/explore-section/ExploreSectionListingView/WithControlPanel';
import { DataType } from '@/constants/explore-section/list-views';
import useExploreColumns from '@/hooks/useExploreColumns';
import { dataAtom, sortStateAtom } from '@/state/explore-section/list-view-atoms';
import { detailUrlWithinLab } from '@/util/common';

type Props = {
  dataType: DataType;
  resourceIds: string[];
  labId: string;
  projectId: string;
};

export default function ExperimentBookmarks({ dataType, resourceIds, labId, projectId }: Props) {
  const [sortState, setSortState] = useAtom(sortStateAtom);
  const columns = useExploreColumns(setSortState, sortState, [], null, dataType);
  const router = useRouter();

  const data = useAtomValue(
    loadable(
      dataAtom({
        dataType,
        brainRegionSource: 'selected',
        bookmarkResourceIds: resourceIds,
      })
    )
  );

  const dataSource = data.state === 'hasData' ? data.data : [];

  return (
    <div
      id="bookmark-list-container"
      style={{
        height: `${dataSource.length * 100}px`,
        maxHeight: '1200px',
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
                  onCellClick={(_, record) => {
                    router.push(
                      detailUrlWithinLab(
                        labId,
                        projectId,
                        record._source.project.label,
                        record._id,
                        'morphology'
                      )
                    );
                  }}
                />
              </div>
            </>
          )}
        </WithControlPanel>
      </div>
    </div>
  );
}
