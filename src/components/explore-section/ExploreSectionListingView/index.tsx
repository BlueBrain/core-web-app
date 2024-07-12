import { ReactNode, useEffect, useState, useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { RowSelectionType } from 'antd/es/table/interface';

import FilterControls from './FilterControls';
import { RenderButtonProps } from './useRowSelection';
import { ExploreESHit } from '@/types/explore-section/es';
import ExploreSectionTable, {
  OnCellClick,
} from '@/components/explore-section/ExploreSectionListingView/ExploreSectionTable';
import WithControlPanel from '@/components/explore-section/ExploreSectionListingView/WithControlPanel';
import NumericResultsInfo from '@/components/explore-section/ExploreSectionListingView/NumericResultsInfo';
import useExploreColumns from '@/hooks/useExploreColumns';
import { sortStateAtom, dataAtom } from '@/state/explore-section/list-view-atoms';
import { ExploreDataScope } from '@/types/explore-section/application';
import { ExploreSectionResource } from '@/types/explore-section/resources';
import { DataType } from '@/constants/explore-section/list-views';
import { VirtualLabInfo } from '@/types/virtual-lab/common';

export default function DefaultListView({
  dataType,
  dataScope,
  renderButton,
  onCellClick,
  selectionType,
  virtualLabInfo,
}: {
  dataType: DataType;
  dataScope: ExploreDataScope;
  renderButton?: (props: RenderButtonProps) => ReactNode;
  onCellClick?: OnCellClick;
  selectionType?: RowSelectionType;
  virtualLabInfo?: VirtualLabInfo;
}) {
  const [sortState, setSortState] = useAtom(sortStateAtom);

  const [dataSource, setDataSource] = useState<ExploreESHit<ExploreSectionResource>[]>();
  const columns = useExploreColumns(setSortState, sortState, [], null, dataType);
  const data = useAtomValue(
    useMemo(
      () =>
        loadable(
          dataAtom({
            dataType,
            dataScope,
            virtualLabInfo,
          })
        ),
      [dataScope, dataType, virtualLabInfo]
    )
  );

  useEffect(() => {
    if (data.state === 'hasData') {
      setDataSource(data.data);
    }
  }, [data, setDataSource]);

  return (
    <div className="h-full bg-[#d1d1d1]" data-testid="explore-section-listing-view">
      <div className="relative grid h-full max-h-[calc(100vh-3.3rem)] w-full grid-cols-[auto_max-content] grid-rows-1 overflow-x-auto overflow-y-hidden">
        <WithControlPanel
          dataType={dataType}
          dataScope={dataScope}
          virtualLabInfo={virtualLabInfo}
          className="relative"
        >
          {({ activeColumns, displayControlPanel, setDisplayControlPanel, filters }) => (
            <>
              <FilterControls
                filters={filters}
                displayControlPanel={displayControlPanel}
                dataType={dataType}
                setDisplayControlPanel={setDisplayControlPanel}
                className="sticky top-0 !max-h-24 px-4 py-5"
              >
                <NumericResultsInfo
                  dataType={dataType}
                  dataScope={dataScope}
                  virtualLabInfo={virtualLabInfo}
                />
              </FilterControls>
              <ExploreSectionTable
                columns={columns.filter(({ key }) => (activeColumns || []).includes(key as string))}
                dataContext={{ virtualLabInfo, dataScope, dataType }}
                dataSource={dataSource}
                loading={data.state === 'loading'}
                onCellClick={onCellClick}
                renderButton={renderButton}
                selectionType={selectionType}
              />
            </>
          )}
        </WithControlPanel>
      </div>
    </div>
  );
}
