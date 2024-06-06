import { Dispatch, ReactNode, SetStateAction, useMemo, useState } from 'react';
import { useAtomValue, useAtom } from 'jotai';
import { unwrap } from 'jotai/utils';

import ControlPanel from '@/components/explore-section/ControlPanel';
import {
  activeColumnsAtom,
  aggregationsAtom,
  filtersAtom,
} from '@/state/explore-section/list-view-atoms';
import { ExploreDataBrainRegionSource } from '@/types/explore-section/application';
import { Filter } from '@/components/Filter/types';
import { DataType } from '@/constants/explore-section/list-views';
import { BookmarkScope } from '@/state/virtual-lab/bookmark';
import { classNames } from '@/util/utils';

export default function WithControlPanel({
  children,
  dataType,
  brainRegionSource,
  bookmarkScope,
  className,
}: {
  children: (props: {
    activeColumns?: string[];
    displayControlPanel: boolean;
    setDisplayControlPanel: Dispatch<SetStateAction<boolean>>;
    filters?: Filter[];
  }) => ReactNode;
  dataType: DataType;
  brainRegionSource: ExploreDataBrainRegionSource;
  bookmarkScope?: BookmarkScope;
  className?: string;
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
      () => unwrap(aggregationsAtom({ dataType, brainRegionSource, bookmarkScope })),
      [dataType, brainRegionSource, bookmarkScope]
    )
  );

  return (
    <>
      <section
        className={classNames(
          'flex h-full w-full min-w-0 flex-col gap-5 bg-white before:shadow-lg after:shadow-md',
          className
        )}
      >
        {children({ activeColumns, displayControlPanel, setDisplayControlPanel, filters })}
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
