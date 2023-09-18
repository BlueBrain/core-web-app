import { ReactNode, useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { loadable, unwrap } from 'jotai/utils';
import HeaderPanel from './HeaderPanel';
import FilterControls from './FilterControls';
import WithControlPanel from './WithControlPanel';
import { ExploreResource } from '@/types/explore-section/es';
import ExploreSectionTable from '@/components/explore-section/ExploreSectionListingView/ExploreSectionTable';
import {
  activeColumnsAtom,
  dataAtom,
  sortStateAtom,
} from '@/state/explore-section/list-view-atoms';
import { RenderButtonProps } from '@/components/explore-section/ExploreSectionListingView/WithRowSelection';
import useExploreColumns from '@/hooks/useExploreColumns';

function DefaultListView({
  enableDownload,
  title,
  experimentTypeName,
  resourceId,
  renderButton,
}: {
  enableDownload?: boolean;
  title: string;
  experimentTypeName: string;
  resourceId?: string;
  renderButton?: (props: RenderButtonProps) => ReactNode;
}) {
  const activeColumns = useAtomValue(activeColumnsAtom({ experimentTypeName }));
  const scopedDataAtom = dataAtom({ experimentTypeName, resourceId });
  const data = useAtomValue(useMemo(() => loadable(scopedDataAtom), [scopedDataAtom]));
  const unwrappedData = useAtomValue(
    useMemo(() => unwrap(scopedDataAtom, (prev) => prev ?? []), [scopedDataAtom])
  );
  const [sortState, setSortState] = useAtom(sortStateAtom);

  const columns = useExploreColumns(setSortState, sortState, [
    {
      title: '#',
      key: 'index',
      className: 'text-primary-7',
      render: (_text: string, _record: ExploreResource, index: number) => index + 1,
      width: 70,
    },
  ]);

  const loading = data.state === 'loading' || !activeColumns;
  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <WithControlPanel loading={loading} experimentTypeName={experimentTypeName}>
        {({ displayControlPanel, setDisplayControlPanel }) => (
          <>
            <HeaderPanel
              loading={loading}
              title={title}
              experimentTypeName={experimentTypeName}
              resourceId={resourceId}
            >
              <FilterControls
                displayControlPanel={displayControlPanel}
                setDisplayControlPanel={setDisplayControlPanel}
                experimentTypeName={experimentTypeName}
              />
            </HeaderPanel>
            <ExploreSectionTable
              columns={columns.filter(({ key }) => (activeColumns || []).includes(key as string))}
              dataSource={unwrappedData}
              loading={data.state === 'loading'}
              enableDownload={enableDownload}
              experimentTypeName={experimentTypeName}
              hasError={data.state === 'hasError'}
              renderButton={renderButton}
            />
          </>
        )}
      </WithControlPanel>
    </div>
  );
}

export default DefaultListView;
