'use client';

import DefaultListView from '@/components/explore-section/ExploreSectionListingView';
import {
  experimentDataTypeAtom,
  triggerRefetchAtom,
  filtersAtom,
} from '@/state/explore-section/list-view-atoms';
import useListPage from '@/hooks/useListPage';
import { NEURON_MORPHOLOGY } from '@/constants/explore-section/list-views';

export default function MorphologyListingPage() {
  useListPage({ experimentDataTypeAtom, triggerRefetchAtom, filtersAtom, TYPE: NEURON_MORPHOLOGY });

  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <DefaultListView enableDownload title="Neuron morphology" />
    </div>
  );
}
