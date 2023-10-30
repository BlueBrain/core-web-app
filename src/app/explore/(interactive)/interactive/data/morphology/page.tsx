'use client';

import DefaultListViewTabs from '@/components/explore-section/ExploreSectionListingView';
import { NEURON_MORPHOLOGY } from '@/constants/explore-section/list-views';

export default function MorphologyListingPage() {
  return (
    <DefaultListViewTabs
      enableDownload
      title="Neuron morphology"
      experimentTypeName={NEURON_MORPHOLOGY}
      brainRegionSource="visible"
    />
  );
}
