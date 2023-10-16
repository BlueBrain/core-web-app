import { Dispatch, ReactNode, SetStateAction, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import LoadMoreButton from '@/components/explore-section/ExploreSectionListingView/LoadMoreButton';
import ControlPanel from '@/components/explore-section/ControlPanel';
import { activeColumnsAtom } from '@/state/explore-section/list-view-atoms';

export default function WithControlPanel({
  children,
  experimentTypeName,
  resourceId,
}: {
  children: (props: {
    activeColumns?: string[];
    displayControlPanel: boolean;
    setDisplayControlPanel: Dispatch<SetStateAction<boolean>>;
  }) => ReactNode;
  experimentTypeName: string;
  resourceId?: string;
}) {
  const activeColumns = useAtomValue(
    useMemo(
      () => unwrap(activeColumnsAtom({ experimentTypeName, resourceId })),
      [experimentTypeName, resourceId]
    )
  );

  const [displayControlPanel, setDisplayControlPanel] = useState(false);

  return (
    <div className="flex">
      <section className="w-full min-h-screen h-screen flex flex-col gap-5 bg-white pb-12 pl-3 pr-3 pt-8 overflow-scroll relative">
        {children({ activeColumns, displayControlPanel, setDisplayControlPanel })}
        <LoadMoreButton experimentTypeName={experimentTypeName} resourceId={resourceId} />
      </section>
      {displayControlPanel && (
        <ControlPanel
          toggleDisplay={() => setDisplayControlPanel(false)}
          experimentTypeName={experimentTypeName}
          resourceId={resourceId}
        />
      )}
    </div>
  );
}
