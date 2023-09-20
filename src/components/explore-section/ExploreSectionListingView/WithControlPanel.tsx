import { Dispatch, ReactNode, SetStateAction, useState } from 'react';
import LoadMoreButton from '@/components/explore-section/ExploreSectionListingView/LoadMoreButton';
import ControlPanel from '@/components/explore-section/ControlPanel';

export default function WithControlPanel({
  children,
  experimentTypeName,
  resourceId,
}: {
  children: ({
    displayControlPanel,
    setDisplayControlPanel,
  }: {
    displayControlPanel: boolean;
    setDisplayControlPanel: Dispatch<SetStateAction<boolean>>;
  }) => ReactNode;
  experimentTypeName: string;
  resourceId?: string;
}) {
  const [displayControlPanel, setDisplayControlPanel] = useState(false);

  return (
    <>
      <section className="w-full h-screen flex flex-col gap-5 bg-white pb-12 pl-7 pr-3 pt-8 overflow-scroll relative">
        {children({ displayControlPanel, setDisplayControlPanel })}
        <LoadMoreButton experimentTypeName={experimentTypeName} resourceId={resourceId} />
      </section>
      {displayControlPanel && (
        <ControlPanel
          toggleDisplay={() => setDisplayControlPanel(false)}
          experimentTypeName={experimentTypeName}
          resourceId={resourceId}
        />
      )}
    </>
  );
}
