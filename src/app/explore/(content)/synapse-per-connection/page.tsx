'use client';

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { typeAtom } from '@/state/explore-section/list-view-atoms';

const TYPE = 'https://neuroshapes.org/SynapsePerConnection';

export default function SynapsePerConnectionListingPage() {
  const setType = useSetAtom(typeAtom);

  useEffect(() => setType(TYPE), [setType]);

  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <ExploreSectionListingView enableDownload title="Synapse per connection" />
    </div>
  );
}
