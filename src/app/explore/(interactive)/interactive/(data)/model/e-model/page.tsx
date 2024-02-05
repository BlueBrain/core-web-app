'use client';

import { DataType } from '@/constants/explore-section/list-views';
import WithExploreExperiment from '@/components/explore-section/WithExploreExperiment';

export default function EModelListingPage() {
  return <WithExploreExperiment dataType={DataType.CircuitEModel} brainRegionSource="selected" />;
}
