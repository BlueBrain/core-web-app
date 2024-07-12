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
import { BookmarkTabsName } from '@/types/virtual-lab/bookmark';
import {
  MODEL_DATA_TYPES,
  ModelTypeNames,
} from '@/constants/explore-section/data-types/model-data-types';
import { ExploreDataScope } from '@/types/explore-section/application';

type Props = {
  dataType: DataType;
  labId: string;
  projectId: string;
  bookmarkTabName: BookmarkTabsName;
};

export default function BookmarkedResourcesTable({
  dataType,
  labId,
  projectId,
  bookmarkTabName,
}: Props) {
  const [sortState, setSortState] = useAtom(sortStateAtom);
  const columns = useExploreColumns(setSortState, sortState, [], null, dataType);
  const router = useRouter();
  const data = useAtomValue(
    loadable(
      dataAtom({
        dataType,
        dataScope: ExploreDataScope.BookmarkedResources,
        virtualLabInfo: { virtualLabId: labId, projectId },
      })
    )
  );

  const dataSource = data.state === 'hasData' ? data.data : [];

  return (
    <div
      id="bookmark-list-container"
      data-testid={`${dataType}-tab-panel`}
      style={{
        height: `${dataSource.length * 200 + 150}px`,
        maxHeight: '1200px',
        minHeight: '450px',
      }}
    >
      <div className="grid h-full w-full grid-cols-[auto_max-content] grid-rows-1 overflow-x-auto">
        <WithControlPanel
          dataType={dataType}
          dataScope={ExploreDataScope.BookmarkedResources}
          virtualLabInfo={{ virtualLabId: labId, projectId }}
        >
          {({ activeColumns, displayControlPanel, setDisplayControlPanel, filters }) => (
            <>
              <FilterControls
                filters={filters}
                displayControlPanel={displayControlPanel}
                dataType={dataType}
                setDisplayControlPanel={setDisplayControlPanel}
                className="sticky top-0 px-4 py-5"
              />

              <ExploreSectionTable
                columns={columns.filter(({ key }) => (activeColumns || []).includes(key as string))}
                dataContext={{
                  dataScope: ExploreDataScope.BookmarkedResources,
                  virtualLabInfo: { virtualLabId: labId, projectId },
                  dataType,
                }}
                dataSource={dataSource}
                loading={data.state === 'loading'}
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
                      bookmarkTabName,
                      bookmarkTabName === BookmarkTabsName.EXPERIMENTS
                        ? (EXPERIMENT_DATA_TYPES[dataType].name as ExperimentTypeNames)
                        : (MODEL_DATA_TYPES[dataType].name as ModelTypeNames)
                    )
                  );
                }}
              />
            </>
          )}
        </WithControlPanel>
      </div>
    </div>
  );
}
