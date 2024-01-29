import { useEffect, useMemo } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { unwrap } from 'jotai/utils';
import { axesAtom } from '../Simulations/state';
import NumericResultsInfo from './NumericResultsInfo';
import FilterControls from './FilterControls';
import ListTable from '@/components/ListTable';
import WithControlPanel from '@/components/explore-section/ExploreSectionListingView/WithControlPanel';
import useExploreColumns from '@/hooks/useExploreColumns';
import {
  activeColumnsAtom,
  dataAtom,
  sortStateAtom,
  dimensionColumnsAtom,
} from '@/state/explore-section/list-view-atoms';
import { DataType } from '@/constants/explore-section/list-views';

export default function SimulationCampaignListView({ dataType }: { dataType: DataType }) {
  const activeColumns = useAtomValue(
    useMemo(() => unwrap(activeColumnsAtom({ dataType })), [dataType])
  );
  const dataSource = useAtomValue(useMemo(() => unwrap(dataAtom({ dataType })), [dataType]));

  const [sortState, setSortState] = useAtom(sortStateAtom);
  const dimensionColumns = useAtomValue(
    useMemo(() => unwrap(dimensionColumnsAtom({ dataType })), [dataType])
  );
  const columns = useExploreColumns(setSortState, sortState, [], dimensionColumns).filter(
    ({ key }) => (activeColumns || []).includes(key as string)
  );

  const loading = !dataSource || !dimensionColumns;

  /* Resets the dimensions axes when changing to list view so that when the next Campaign is viewd users
   don'see invalid dimensions from another campaign */
  const setAxes = useSetAtom(axesAtom);

  useEffect(() => {
    setAxes({ xAxis: undefined, yAxis: undefined });
  }, [setAxes]);

  return (
    <div className="flex min-h-screen h-full max-h-screen bg-[#d1d1d1] w-full">
      <div className="relative grid grid-cols-[auto_max-content] grid-rows-1 w-full h-full overflow-x-auto overflow-y-hidden">
        <WithControlPanel dataType={dataType} brainRegionSource="root">
          {({ displayControlPanel, setDisplayControlPanel }) => (
            <>
              <div className="grid grid-cols-[max-content_1fr_max-content] items-center justify-between gap-5 w-full px-5 sticky top-0">
                <NumericResultsInfo dataType={dataType} brainRegionSource="root" />
                <FilterControls
                  displayControlPanel={displayControlPanel}
                  setDisplayControlPanel={setDisplayControlPanel}
                  dataType={dataType}
                />
              </div>
              <div className="px-4 h-full w-full">
                <ListTable
                  {...{
                    columns,
                    dataSource,
                    loading,
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
