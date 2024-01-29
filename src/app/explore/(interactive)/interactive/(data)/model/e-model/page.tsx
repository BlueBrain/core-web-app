'use client';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { DataType } from '@/constants/explore-section/list-views';

export default function EModelListingPage() {
  return (
    <ExploreSectionListingView dataType={DataType.CircuitEModel} brainRegionSource="selected" />
  );
}
