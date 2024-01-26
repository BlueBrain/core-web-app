'use client';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { DataType } from '@/constants/explore-section/list-views';

export default function NeuronDensityListingPage() {
  return (
    <ExploreSectionListingView
      enableDownload
      dataType={DataType.ExperimentalNeuronDensity}
      brainRegionSource="selected"
    />
  );
}
