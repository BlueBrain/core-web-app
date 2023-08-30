'use client';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import {
  experimentDataTypeAtom,
  triggerRefetchAtom,
  filtersAtom,
} from '@/state/explore-section/list-view-atoms';
import useListPage from '@/hooks/useListPage';
import { SYNAPSE_PER_CONNECTION } from '@/constants/explore-section/list-views';

export default function SynapsePerConnectionListingPage() {
  useListPage({
    experimentDataTypeAtom,
    triggerRefetchAtom,
    filtersAtom,
    TYPE: SYNAPSE_PER_CONNECTION,
  });

  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <ExploreSectionListingView title="Synapse per connection" />
    </div>
  );
}
