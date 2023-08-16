'use client';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { typeAtom, triggerRefetchAtom, filtersAtom } from '@/state/explore-section/list-view-atoms';
import useListPage from '@/hooks/useListPage';

const TYPE = 'https://bbp.epfl.ch/ontologies/core/bmo/ExperimentalTrace';

export default function EphysPage() {
  useListPage({ typeAtom, triggerRefetchAtom, filtersAtom, TYPE });

  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <ExploreSectionListingView enableDownload title="Neuron electrophysiology" />
    </div>
  );
}
