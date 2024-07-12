'use client';

import { DataType } from '@/constants/explore-section/list-views';
import WithExploreExperiment from '@/components/explore-section/WithExploreExperiment';

export default function EphysPage() {
  return (
    <WithExploreExperiment
      dataType={DataType.ExperimentalElectroPhysiology}
      brainRegionSource="selected"
    />
  );
}
