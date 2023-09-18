import { useMemo} from 'react';
import { useAtomValue } from 'jotai';
import { loadable, unwrap } from 'jotai/utils';
import HeaderPanel from './HeaderPanel';
import FilterControls from './FilterControls';
import WithControlPanel from './WithControlPanel';
import ListTable from '@/components/ListTable';
import useExploreColumns from '@/hooks/useExploreColumns';
import {
  activeColumnsAtom,
  dataAtom,
  dimensionColumnsAtom,
} from '@/state/explore-section/list-view-atoms';

function SimulationCampaignView({
    title,
    experimentTypeName,
  }: {
    title: string;
    experimentTypeName: string;
  }) {
    const activeColumns = useAtomValue(
      useMemo(() => unwrap(activeColumnsAtom({ experimentTypeName })), [experimentTypeName])
    );
    const scopedDataAtom = dataAtom({ experimentTypeName });
    const data = useAtomValue(useMemo(() => loadable(scopedDataAtom), [scopedDataAtom]));
    const unwrappedData = useAtomValue(
      useMemo(() => unwrap(scopedDataAtom, (prev) => prev ?? []), [scopedDataAtom])
    );
  
    const dimensionColumns = useAtomValue(
      useMemo(() => unwrap(dimensionColumnsAtom({ experimentTypeName })), [experimentTypeName])
    );
  
    const columns = useExploreColumns(setSortState, sortState, [], dimensionColumns);
  
    const loading = data.state === 'loading' || !dimensionColumns;
  
    return (
      <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
        <WithControlPanel loading={loading} experimentTypeName={experimentTypeName}>
          {({ displayControlPanel, setDisplayControlPanel }) => (
            <>
              <HeaderPanel loading={loading} title={title} experimentTypeName={experimentTypeName}>
                <FilterControls
                  displayControlPanel={displayControlPanel}
                  setDisplayControlPanel={setDisplayControlPanel}
                  experimentTypeName={experimentTypeName}
                />
              </HeaderPanel>
              <ListTable
                columns={columns.filter(({ key }) => (activeColumns || []).includes(key as string))}
                dataSource={unwrappedData}
                loading={loading}
              />
            </>
          )}
        </WithControlPanel>
      </div>
    );
  }
  
  export default SimulationCampaignView