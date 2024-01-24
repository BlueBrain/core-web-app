import { Dispatch, ReactNode, SetStateAction, useMemo, useState } from 'react';
import { useAtomValue, useAtom } from 'jotai';
import { unwrap } from 'jotai/utils';
import LoadMoreButton from '@/components/explore-section/ExploreSectionListingView/LoadMoreButton';
import ControlPanel from '@/components/explore-section/ControlPanel';
import {
  activeColumnsAtom,
  aggregationsAtom,
  filtersAtom,
} from '@/state/explore-section/list-view-atoms';
import { ExploreDataBrainRegionSource } from '@/types/explore-section/application';
import { Filter } from '@/components/Filter/types';
import { DataType } from '@/constants/explore-section/list-views';

export default function WithControlPanel({
  children,
  dataType,
  brainRegionSource,
}: {
  children: (props: {
    activeColumns?: string[];
    displayControlPanel: boolean;
    setDisplayControlPanel: Dispatch<SetStateAction<boolean>>;
    filters?: Filter[];
  }) => ReactNode;
  dataType: DataType;
  brainRegionSource: ExploreDataBrainRegionSource;
}) {
  const activeColumns = useAtomValue(
    useMemo(() => unwrap(activeColumnsAtom({ dataType })), [dataType])
  );

  const [displayControlPanel, setDisplayControlPanel] = useState(false);

  const [filters, setFilters] = useAtom(
    useMemo(() => unwrap(filtersAtom({ dataType })), [dataType])
  );

  const aggregations = useAtomValue(
    useMemo(
      () => unwrap(aggregationsAtom({ dataType, brainRegionSource })),
      [dataType, brainRegionSource]
    )
  );

  return (
    <>
      <section className="w-full h-full flex flex-col gap-5 bg-white pb-24 p-3 pt-8 relative overflow-auto min-w-0">
        {children({ activeColumns, displayControlPanel, setDisplayControlPanel, filters })}
        <LoadMoreButton dataType={dataType} brainRegionSource={brainRegionSource} />
      </section>
      {displayControlPanel && filters && (
        <ControlPanel
          data-testid="listing-view-control-panel"
          aggregations={aggregations}
          filters={filters}
          setFilters={setFilters}
          toggleDisplay={() => setDisplayControlPanel(false)}
          dataType={dataType}
        />
      )}
    </>
  );
}
