import { ReactNode, useState } from 'react';
import { useAtom } from 'jotai';
import { InsertRowAboveOutlined, UnorderedListOutlined } from '@ant-design/icons';
import FilterControls from './FilterControls';
import { RenderButtonProps } from './WithRowSelection';
import WithGeneralization from './WithGeneralization';
import { ExploreResource } from '@/types/explore-section/es';
import ExploreSectionTable from '@/components/explore-section/ExploreSectionListingView/ExploreSectionTable';
import WithControlPanel from '@/components/explore-section/ExploreSectionListingView/WithControlPanel';
import HeaderPanel from '@/components/explore-section/ExploreSectionListingView/HeaderPanel';
import useExploreColumns from '@/hooks/useExploreColumns';
import { sortStateAtom } from '@/state/explore-section/list-view-atoms';
import { DETAIL_FIELDS_CONFIG } from '@/constants/explore-section/detail-fields-config';
import InferredResourceHeader from '@/components/explore-section/InferredResourceHeader';
import CardView from '@/components/explore-section/CardView';

type ViewMode = 'table' | 'card';

export default function DefaultListView({
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
  const [viewMode, setViewMode] = useState<ViewMode>('table');

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
    <div className="min-h-screen" style={{ background: '#d1d1d1' }}>
      <WithGeneralization experimentTypeName={experimentTypeName}>
        {({ data, expandable, resourceId, tabNavigation, resourceInfo }) => (
          <WithControlPanel experimentTypeName={experimentTypeName} resourceId={resourceId}>
            {({ activeColumns, displayControlPanel, setDisplayControlPanel }) => (
              <>
                <div className="flex flex-col">
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
                {resourceInfo && (
                  <InferredResourceHeader
                    fields={DETAIL_FIELDS_CONFIG[experimentTypeName]}
                    resourceInfo={resourceInfo}
                  />
                )}
                <div className="flex gap-2 place-content-end  items-center ">
                  <div className="text-primary-7">View:</div>
                  <button onClick={() => setViewMode('table')} type="button">
                    <UnorderedListOutlined
                      className={
                        viewMode === 'table'
                          ? 'bg-primary-7 p-1 text-neutral-1'
                          : 'text-neutral-3 p-1'
                      }
                    />
                  </button>
                  <button onClick={() => setViewMode('card')} type="button">
                    <InsertRowAboveOutlined
                      className={
                        viewMode === 'card'
                          ? 'bg-primary-7 p-1 text-neutral-1'
                          : 'text-neutral-3 p-1'
                      }
                    />
                  </button>
                </div>
                {viewMode === 'table' ? (
                  <ExploreSectionTable
                    columns={columns.filter(({ key }) =>
                      (activeColumns || []).includes(key as string)
                    )}
                    dataSource={data}
                    enableDownload={enableDownload}
                    expandable={expandable}
                    experimentTypeName={experimentTypeName}
                    loading={!data}
                    renderButton={renderButton}
                  />
                ) : (
                  <CardView data={data} experimentTypeName={experimentTypeName} />
                )}
              </>
            )}
          </WithControlPanel>
        )}
      </WithGeneralization>
    </div>
  );
}
