import { Dispatch, ReactNode, SetStateAction, useMemo, useState} from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {  unwrap } from 'jotai/utils';
import LoadMoreButton from '@/components/explore-section/ExploreSectionListingView/LoadMoreButton';
import ControlPanel from '@/components/explore-section/ControlPanel';
import {
  totalAtom,
  pageSizeAtom,
} from '@/state/explore-section/list-view-atoms';


function WithControlPanel({
    children,
    loading,
    experimentTypeName,
  }: {
    children: ({
      displayControlPanel,
      setDisplayControlPanel,
    }: {
      displayControlPanel: boolean;
      setDisplayControlPanel: Dispatch<SetStateAction<boolean>>;
    }) => ReactNode;
    loading: boolean;
    experimentTypeName: string;
  }) {
    const total = useAtomValue(
      useMemo(() => unwrap(totalAtom({ experimentTypeName })), [experimentTypeName])
    );
  
    const [pageSize, setPageSize] = useAtom(pageSizeAtom);
  
    const [displayControlPanel, setDisplayControlPanel] = useState(false);
  
    return (
      <>
        <section className="w-full h-screen flex flex-col gap-5 bg-white pb-12 pl-7 pr-3 pt-8 overflow-scroll relative">
          {children({ displayControlPanel, setDisplayControlPanel })}
          <LoadMoreButton
            disabled={!!total && pageSize > total}
            loading={loading}
            onClick={() => setPageSize(pageSize + 30)}
          >
            {!!total && pageSize < total ? 'Load 30 more results...' : 'All resources are loaded'}
          </LoadMoreButton>
        </section>
        {displayControlPanel && (
          <ControlPanel
            toggleDisplay={() => setDisplayControlPanel(false)}
            experimentTypeName={experimentTypeName}
          />
        )}
      </>
    );
  }

  export default WithControlPanel;