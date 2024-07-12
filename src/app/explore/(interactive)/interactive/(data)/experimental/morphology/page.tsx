'use client';

import { DataType } from '@/constants/explore-section/list-views';
import WithExploreExperiment from '@/components/explore-section/WithExploreExperiment';
import { ExploreDataScope } from '@/types/explore-section/application';

export default function MorphologyListingPage() {
  return (
    <WithExploreExperiment
      dataType={DataType.ExperimentalNeuronMorphology}
      dataScope={ExploreDataScope.SelectedBrainRegion}
    />
  );
}
