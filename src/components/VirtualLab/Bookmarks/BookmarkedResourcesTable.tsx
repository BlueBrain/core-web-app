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
import { SIMULATION_DATA_TYPES } from '@/constants/explore-section/data-types/simulation-data-types';
import { SimulationTypeNames } from '@/types/simulation/single-neuron';

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
  const dataScope = ExploreDataScope.BookmarkedResources;
  const router = useRouter();
  const data = useAtomValue(
    loadable(
      dataAtom({
        dataType,
        dataScope,
        virtualLabInfo: { virtualLabId: labId, projectId },
      })
    )
  );

  const dataSource = data.state === 'hasData' ? data.data : [];

  const modelTypeToModelName = (type: DataType, tabName: BookmarkTabsName) => {
    switch (tabName) {
      case BookmarkTabsName.EXPERIMENTS:
        return EXPERIMENT_DATA_TYPES[type].name as ExperimentTypeNames;
      case BookmarkTabsName.MODELS:
        return MODEL_DATA_TYPES[dataType].name as ModelTypeNames;
      case BookmarkTabsName.SIMULATIONS:
        return SIMULATION_DATA_TYPES[dataType].name as SimulationTypeNames;
      default:
        throw new Error(`${tabName} is not supported as a bookmark`);
    }
  };

  return (
    <div id="bookmark-list-container" data-testid={`${dataType}-tab-panel`}>
      <div className="overflow-x-hidden">
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
                dataScope={dataScope}
                setDisplayControlPanel={setDisplayControlPanel}
                className="sticky top-0 px-4 py-5"
              />

              <ExploreSectionTable
                scrollable={false}
                autohideControls
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
                      modelTypeToModelName(dataType, bookmarkTabName)
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
