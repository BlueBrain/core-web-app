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

export default function WithControlPanel({
  children,
  experimentTypeName,
  brainRegionSource,
}: {
  children: (props: {
    activeColumns?: string[];
    displayControlPanel: boolean;
    setDisplayControlPanel: Dispatch<SetStateAction<boolean>>;
    filters?: Filter[];
  }) => ReactNode;
  experimentTypeName: string;
  brainRegionSource: ExploreDataBrainRegionSource;
}) {
  const activeColumns = useAtomValue(
    useMemo(() => unwrap(activeColumnsAtom({ experimentTypeName })), [experimentTypeName])
  );

  const [displayControlPanel, setDisplayControlPanel] = useState(false);

  const aggregations = useAtomValue(
    useMemo(
      () => unwrap(aggregationsAtom({ experimentTypeName, brainRegionSource })),
      [brainRegionSource, experimentTypeName]
    )
  );

  const [filters, setFilters] = useAtom(
    useMemo(() => unwrap(filtersAtom({ experimentTypeName })), [experimentTypeName])
  );

  return (
    <div className="grid grid-cols-[auto_max-content] grid-rows-1 w-full">
      <section className="w-full min-h-screen h-screen flex flex-col gap-5 bg-white pb-12 pl-3 pr-3 pt-8 overflow-scroll relative">
        {children({ activeColumns, displayControlPanel, setDisplayControlPanel, filters })}
        <LoadMoreButton
          experimentTypeName={experimentTypeName}
          brainRegionSource={brainRegionSource}
        />
      </section>
      {displayControlPanel && aggregations && filters && (
        <ControlPanel
          data-testid="listing-view-control-panel"
          aggregations={aggregations}
          filters={filters}
          setFilters={setFilters}
          toggleDisplay={() => setDisplayControlPanel(false)}
          experimentTypeName={experimentTypeName}
        />
      )}
    </div>
  );
}
