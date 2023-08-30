'use client';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import {
  experimentDataTypeAtom,
  triggerRefetchAtom,
  filtersAtom,
} from '@/state/explore-section/list-view-atoms';
import useListPage from '@/hooks/useListPage';
import { ELECTRO_PHYSIOLOGY } from '@/constants/explore-section/list-views';

export default function EphysPage() {
  useListPage({
    experimentDataTypeAtom,
    triggerRefetchAtom,
    filtersAtom,
    TYPE: ELECTRO_PHYSIOLOGY,
  });

  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <ExploreSectionListingView enableDownload title="Neuron electrophysiology" />
    </div>
  );
}
