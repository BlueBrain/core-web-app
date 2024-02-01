'use client';

import { DataType } from '@/constants/explore-section/list-views';
import WithExploreExperiment from '@/components/explore-section/WithExploreExperiment';

export default function BoutonDensityListingPage() {
  return (
    <WithExploreExperiment
      dataType={DataType.ExperimentalBoutonDensity}
      brainRegionSource="selected"
    />
  );
}
