'use client';

import { DataType } from '@/constants/explore-section/list-views';
import WithExploreExperiment from '@/components/explore-section/WithExploreExperiment';

export default function SynapsePerConnectionListingPage() {
  return (
    <WithExploreExperiment
      dataType={DataType.ExperimentalSynapsePerConnection}
      brainRegionSource="selected"
    />
  );
}
