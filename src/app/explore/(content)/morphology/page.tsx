'use client';

import DefaultListView from '@/components/explore-section/ExploreSectionListingView';
import { typeAtom, triggerRefetchAtom, filtersAtom } from '@/state/explore-section/list-view-atoms';
import useListPage from '@/hooks/useListPage';

const TYPE = 'https://neuroshapes.org/ReconstructedNeuronMorphology';

export default function MorphologyListingPage() {
  useListPage({ typeAtom, triggerRefetchAtom, filtersAtom, TYPE });

  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <DefaultListView enableDownload title="Neuron morphology" />
    </div>
  );
}
