'use client';

import { DataType } from '@/constants/explore-section/list-views';
import WithExploreExperiment from '@/components/explore-section/WithExploreExperiment';

export default function MorphologyListingPage() {
  return (
    <WithExploreExperiment
      enableDownload
      dataType={DataType.ExperimentalNeuronMorphology}
      brainRegionSource="selected"
    />
  );
}
