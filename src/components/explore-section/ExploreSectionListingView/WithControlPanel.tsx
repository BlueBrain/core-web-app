import { Dispatch, ReactNode, SetStateAction, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import LoadMoreButton from '@/components/explore-section/ExploreSectionListingView/LoadMoreButton';
import ControlPanel from '@/components/explore-section/ControlPanel';
import { activeColumnsAtom } from '@/state/explore-section/list-view-atoms';

export default function WithControlPanel({
  children,
  experimentTypeName,
}: {
  children: (props: {
    activeColumns?: string[];
    displayControlPanel: boolean;
    setDisplayControlPanel: Dispatch<SetStateAction<boolean>>;
  }) => ReactNode;
  experimentTypeName: string;
}) {
  const activeColumns = useAtomValue(
    useMemo(() => unwrap(activeColumnsAtom({ experimentTypeName })), [experimentTypeName])
  );

  const [displayControlPanel, setDisplayControlPanel] = useState(false);

  return (
    <div className="grid grid-cols-[auto_max-content] grid-rows-1 w-full">
      <section className="w-full flex flex-col min-h-screen h-screen flex flex-col gap-5 bg-white pb-12 pl-3 pr-3 pt-8 overflow-scroll relative">
        {children({ activeColumns, displayControlPanel, setDisplayControlPanel })}
        <LoadMoreButton experimentTypeName={experimentTypeName} />
      </section>
      {displayControlPanel && (
        <ControlPanel
          toggleDisplay={() => setDisplayControlPanel(false)}
          experimentTypeName={experimentTypeName}
        />
      )}
    </div>
  );
}
