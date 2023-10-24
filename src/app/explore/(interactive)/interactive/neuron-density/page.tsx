'use client';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { NEURON_DENSITY } from '@/constants/explore-section/list-views';

export default function NeuronDensityListingPage() {
  return (
    <ExploreSectionListingView
      enableDownload
      title="Neuron density"
      experimentTypeName={NEURON_DENSITY}
      brainRegionSource="visible"
    />
  );
}
