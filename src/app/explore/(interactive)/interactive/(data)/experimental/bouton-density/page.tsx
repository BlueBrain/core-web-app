'use client';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { DataType } from '@/constants/explore-section/list-views';

export default function BoutonDensityListingPage() {
  return (
    <ExploreSectionListingView
      dataType={DataType.ExperimentalBoutonDensity}
      brainRegionSource="selected"
    />
  );
}
