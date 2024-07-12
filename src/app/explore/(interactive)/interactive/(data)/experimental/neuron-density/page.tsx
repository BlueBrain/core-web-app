'use client';

import { DataType } from '@/constants/explore-section/list-views';
import WithExploreExperiment from '@/components/explore-section/WithExploreExperiment';

export default function NeuronDensityListingPage() {
  return (
    <WithExploreExperiment
      dataType={DataType.ExperimentalNeuronDensity}
      brainRegionSource="selected"
    />
  );
}
