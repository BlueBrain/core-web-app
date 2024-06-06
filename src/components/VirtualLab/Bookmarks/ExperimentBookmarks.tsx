import { useAtom, useAtomValue } from 'jotai';

import { loadable } from 'jotai/utils';
import { useRouter } from 'next/navigation';

import BookmarkFooter from './BookmarkFooter';
import ExploreSectionTable from '@/components/explore-section/ExploreSectionListingView/ExploreSectionTable';
import FilterControls from '@/components/explore-section/ExploreSectionListingView/FilterControls';
import WithControlPanel from '@/components/explore-section/ExploreSectionListingView/WithControlPanel';
import { DataType } from '@/constants/explore-section/list-views';
import useExploreColumns from '@/hooks/useExploreColumns';
import { dataAtom, sortStateAtom } from '@/state/explore-section/list-view-atoms';
import { detailUrlWithinLab } from '@/util/common';
import {
  EXPERIMENT_DATA_TYPES,
  ExperimentTypeNames,
} from '@/constants/explore-section/data-types/experiment-data-types';

type Props = {
  dataType: DataType;
  labId: string;
  projectId: string;
};

export default function ExperimentBookmarks({ dataType, labId, projectId }: Props) {
  const [sortState, setSortState] = useAtom(sortStateAtom);
  const columns = useExploreColumns(setSortState, sortState, [], null, dataType);
  const router = useRouter();
  const data = useAtomValue(
    loadable(
      dataAtom({
        dataType,
        brainRegionSource: 'selected',
        bookmarkScope: { virtualLabId: labId, projectId },
      })
    )
  );

  const dataSource = data.state === 'hasData' ? data.data : [];

  return (
    <div
      id="bookmark-list-container"
      style={{
        height: `${dataSource.length * (dataType === DataType.ExperimentalNeuronMorphology ? 200 : 100) + 150}px`, // Morphology plugin view takes more space
        maxHeight: '1200px',
        minHeight: '450px',
      }}
    >
      <div className="grid w-full grid-cols-[auto_max-content] grid-rows-1 overflow-x-auto">
        <WithControlPanel
          dataType={dataType}
          brainRegionSource="selected"
          bookmarkScope={{ virtualLabId: labId, projectId }}
        >
          {({ activeColumns, displayControlPanel, setDisplayControlPanel, filters }) => (
            <>
              <FilterControls
                filters={filters}
                displayControlPanel={displayControlPanel}
                dataType={dataType}
                setDisplayControlPanel={setDisplayControlPanel}
                className="sticky top-0 !max-h-24 px-4 py-5"
              />

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
                  bookmarkScope={{ virtualLabId: labId, projectId }}
                  renderButton={({ selectedRows, clearSelectedRows }) => (
                    <BookmarkFooter
                      clearSelectedRows={clearSelectedRows}
                      selectedRows={selectedRows}
                      virtualLabId={labId}
                      projectId={projectId}
                      category={dataType}
                    />
                  )}
                  onCellClick={(_, record) => {
                    router.push(
                      detailUrlWithinLab(
                        labId,
                        projectId,
                        record._source.project.label,
                        record._id,
                        EXPERIMENT_DATA_TYPES[dataType].name as ExperimentTypeNames
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
