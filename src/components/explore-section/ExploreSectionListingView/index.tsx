import { ReactNode } from 'react';
import { useAtom } from 'jotai';
import FilterControls from './FilterControls';
import { RenderButtonProps } from './WithRowSelection';
import WithGeneralization from './WithGeneralization';
import { ExploreResource } from '@/types/explore-section/es';
import ExploreSectionTable from '@/components/explore-section/ExploreSectionListingView/ExploreSectionTable';
import WithControlPanel from '@/components/explore-section/ExploreSectionListingView/WithControlPanel';
import HeaderPanel from '@/components/explore-section/ExploreSectionListingView/HeaderPanel';
import useExploreColumns from '@/hooks/useExploreColumns';
import { sortStateAtom } from '@/state/explore-section/list-view-atoms';

export default function DefaultListView ({
  enableDownload,
  experimentTypeName,
  title,
  renderButton,
}: {
  enableDownload?: boolean;
  experimentTypeName: string;
  title: string;
  renderButton?: (props: RenderButtonProps) => ReactNode;
}) {
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
    <div className='min-h-screen' style={{ background: '#d1d1d1' }}>
      <WithGeneralization experimentTypeName={experimentTypeName}>
        {({ data, expandable, resourceId, tabNavigation }) => (
          <WithControlPanel experimentTypeName={experimentTypeName} resourceId={resourceId}>
            {({ activeColumns, displayControlPanel, setDisplayControlPanel }) => (
              <>
                <div className='flex flex-col'>
                  <HeaderPanel
                    experimentTypeName={experimentTypeName}
                    resourceId={resourceId}
                    title={title}
                  />
                </div>
                <FilterControls
                  displayControlPanel={displayControlPanel}
                  experimentTypeName={experimentTypeName}
                  resourceId={resourceId}
                  setDisplayControlPanel={setDisplayControlPanel}
                >
                  {tabNavigation}
                </FilterControls>
                <ExploreSectionTable
                  columns={columns.filter(({ key }) =>
                    (activeColumns || []).includes(key as string)
                  )}
                  dataSource={data}
                  enableDownload={enableDownload}
                  expandable={expandable(resourceId)}
                  experimentTypeName={experimentTypeName}
                  loading={!data}
                  renderButton={renderButton}
                  resourceId={resourceId}
                />
              </>
            )}
          </WithControlPanel>
        )}
      </WithGeneralization>
    </div>
  );
}
