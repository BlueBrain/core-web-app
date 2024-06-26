'use client';

import { DataType } from '@/constants/explore-section/list-views';
import ExploreEModelTable from '@/components/explore-section/EModel/ExploreEModelTable';

export default function EModelListingPage() {
  return <ExploreEModelTable dataType={DataType.CircuitEModel} brainRegionSource="selected" />;
}
