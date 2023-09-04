'use client';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { ELECTRO_PHYSIOLOGY } from '@/constants/explore-section/list-views';

export default function EphysPage() {
  return (
    <ExploreSectionListingView
      enableDownload
      title="Neuron electrophysiology"
      type={ELECTRO_PHYSIOLOGY}
    />
  );
}
