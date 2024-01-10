'use client';

import DefaultListView from '@/components/explore-section/ExploreSectionListingView';
import { NEURON_MORPHOLOGY } from '@/constants/explore-section/list-views';

export default function MorphologyListingPage() {
  return (
    <DefaultListView
      enableDownload
      experimentTypeName={NEURON_MORPHOLOGY}
      brainRegionSource="selected"
    />
  );
}
