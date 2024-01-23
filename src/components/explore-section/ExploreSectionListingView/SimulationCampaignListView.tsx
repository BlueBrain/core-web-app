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

export default function SimulationCampaignListView({
  experimentTypeName,
}: {
  experimentTypeName: string;
}) {
  const activeColumns = useAtomValue(
    useMemo(() => unwrap(activeColumnsAtom({ experimentTypeName })), [experimentTypeName])
  );
  const data = useAtomValue(
    useMemo(() => unwrap(dataAtom({ experimentTypeName })), [experimentTypeName])
  );

  const [sortState, setSortState] = useAtom(sortStateAtom);
  const dimensionColumns = useAtomValue(
    useMemo(() => unwrap(dimensionColumnsAtom({ experimentTypeName })), [experimentTypeName])
  );
  const columns = useExploreColumns(setSortState, sortState, [], dimensionColumns);
  const loading = !data || !dimensionColumns;

  /* Resets the dimensions axes when changing to list view so that when the next Campaign is viewd users
   don'see invalid dimensions from another campaign */
  const setAxes = useSetAtom(axesAtom);

  useEffect(() => {
    setAxes({ xAxis: undefined, yAxis: undefined });
  }, [setAxes]);

  return (
    <div className="flex min-h-screen h-full bg-[#d1d1d1]">
      <div className="grid grid-cols-[auto_max-content] grid-rows-1 w-full h-full overflow-x-auto overflow-y-hidden">
        <WithControlPanel experimentTypeName={experimentTypeName} brainRegionSource="root">
          {({ displayControlPanel, setDisplayControlPanel }) => (
            <>
              <div className="flex flex-col pt-10">
                <NumericResultsInfo
                  experimentTypeName={experimentTypeName}
                  brainRegionSource="root"
                />
              </div>
              <FilterControls
                displayControlPanel={displayControlPanel}
                setDisplayControlPanel={setDisplayControlPanel}
                experimentTypeName={experimentTypeName}
              />
              <ListTable
                columns={columns.filter(({ key }) => (activeColumns || []).includes(key as string))}
                dataSource={data}
                loading={loading}
              />
            </>
          )}
        </WithControlPanel>
      </div>
    </div>
  );
}
