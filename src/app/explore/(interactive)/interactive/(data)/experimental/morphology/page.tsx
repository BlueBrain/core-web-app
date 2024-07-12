'use client';

import { DataType } from '@/constants/explore-section/list-views';
import WithExploreExperiment from '@/components/explore-section/WithExploreExperiment';

export default function MorphologyListingPage() {
  return (
    <WithExploreExperiment
      dataType={DataType.ExperimentalNeuronMorphology}
      brainRegionSource="selected"
    />
  );
}
