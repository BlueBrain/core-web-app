import { useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import HeaderPanel from './HeaderPanel';
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
  title,
  experimentTypeName,
}: {
  title: string;
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

  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <WithControlPanel experimentTypeName={experimentTypeName}>
        {({ displayControlPanel, setDisplayControlPanel }) => (
          <>
            <div className="flex flex-col pt-10">
              <HeaderPanel title={title} experimentTypeName={experimentTypeName} />
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
  );
}
