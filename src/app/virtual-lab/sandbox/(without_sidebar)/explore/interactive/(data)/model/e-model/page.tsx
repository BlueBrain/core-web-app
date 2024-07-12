'use client';

import { DataType } from '@/constants/explore-section/list-views';
import ExploreEModelTable from '@/components/explore-section/EModel/ExploreEModelTable';
import { ExploreDataScope } from '@/types/explore-section/application';

export default function EModelListingPage() {
  return (
    <ExploreEModelTable
      dataType={DataType.CircuitEModel}
      dataScope={ExploreDataScope.SelectedBrainRegion}
    />
  );
}
