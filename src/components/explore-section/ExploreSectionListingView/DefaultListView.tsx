import { useMemo, ReactNode } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import FilterControls from './FilterControls';
import { RenderButtonProps } from './WithRowSelection';
import { ExploreResource } from '@/types/explore-section/es';
import ExploreSectionTable from '@/components/explore-section/ExploreSectionListingView/ExploreSectionTable';
import WithControlPanel from '@/components/explore-section/ExploreSectionListingView/WithControlPanel';
import HeaderPanel from '@/components/explore-section/ExploreSectionListingView/HeaderPanel';
import useExploreColumns from '@/hooks/useExploreColumns';
import {
  activeColumnsAtom,
  dataAtom,
  sortStateAtom,
} from '@/state/explore-section/list-view-atoms';

function DefaultListView({
  enableDownload,
  experimentTypeName,
  resourceId,
  title,
  renderButton,
}: {
  enableDownload?: boolean;
  experimentTypeName: string;
  title: string;
  resourceId?: string;
  renderButton?: (props: RenderButtonProps) => ReactNode;
}) {
  const activeColumns = useAtomValue(
    useMemo(
      () => unwrap(activeColumnsAtom({ experimentTypeName, resourceId })),
      [experimentTypeName, resourceId]
    )
  );
  const data = useAtomValue(
    useMemo(
      () => unwrap(dataAtom({ experimentTypeName, resourceId })),
      [experimentTypeName, resourceId]
    )
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

  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <WithControlPanel experimentTypeName={experimentTypeName} resourceId={resourceId}>
        {({ displayControlPanel, setDisplayControlPanel }) => (
          <>
            <div className="flex flex-col pt-[1rem]">
              <HeaderPanel
                title={title}
                experimentTypeName={experimentTypeName}
                resourceId={resourceId}
              />
            </div>
            <FilterControls
              displayControlPanel={displayControlPanel}
              setDisplayControlPanel={setDisplayControlPanel}
              experimentTypeName={experimentTypeName}
              resourceId={resourceId}
            />
            <ExploreSectionTable
              columns={columns.filter(({ key }) => (activeColumns || []).includes(key as string))}
              dataSource={data}
              loading={!data}
              enableDownload={enableDownload}
              experimentTypeName={experimentTypeName}
              renderButton={renderButton}
            />
          </>
        )}
      </WithControlPanel>
    </div>
  );
}
export default DefaultListView;
