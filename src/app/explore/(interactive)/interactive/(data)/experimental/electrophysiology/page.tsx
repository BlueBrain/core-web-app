'use client';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { DataType } from '@/constants/explore-section/list-views';

export default function EphysPage() {
  return (
    <ExploreSectionListingView
      enableDownload
      dataType={DataType.ExperimentalElectroPhysiology}
      brainRegionSource="selected"
    />
  );
}
