'use client';

import { DataType } from '@/constants/explore-section/list-views';
import WithExploreEModel from '@/components/explore-section/EModel/WithExploreEModel';

export default function EModelListingPage() {
  return <WithExploreEModel dataType={DataType.CircuitEModel} brainRegionSource="selected" />;
}
