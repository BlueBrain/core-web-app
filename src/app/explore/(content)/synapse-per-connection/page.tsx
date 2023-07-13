'use client';

import { useEffect, useRef } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { scrollToRowAtom, typeAtom } from '@/state/explore-section/list-view-atoms';

const TYPE = 'https://neuroshapes.org/SynapsePerConnection';

export default function SynapsePerConnectionListingPage() {
  const setType = useSetAtom(typeAtom);

  useEffect(() => setType(TYPE), [setType]);

  const [scrollToRow, setScrollToRow] = useAtom(scrollToRowAtom);
  const tableRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollToRow.length) {
      setTimeout(() => {
        const scrollTarget = tableRef.current?.querySelector(scrollToRow);

        scrollTarget?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [scrollToRow, setScrollToRow]);

  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <ExploreSectionListingView title="Synapse per connection" tableRef={tableRef} />
    </div>
  );
}
