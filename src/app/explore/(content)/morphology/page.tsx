'use client';

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { typeAtom, triggerRefetchAtom } from '@/state/explore-section/list-view-atoms';

const TYPE = 'https://neuroshapes.org/NeuronMorphology';

export default function MorphologyListingPage() {
  const setType = useSetAtom(typeAtom);
  const refetch = useSetAtom(triggerRefetchAtom);

  useEffect(() => {
    setType(TYPE);
    refetch();
  }, [setType, refetch]);

  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <ExploreSectionListingView enableDownload title="Neuron morphology" />
    </div>
  );
}
