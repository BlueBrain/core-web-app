'use client';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { DataType } from '@/constants/explore-section/list-views';

export default function SynapsePerConnectionListingPage() {
  return (
    <ExploreSectionListingView
      dataType={DataType.ExperimentalSynapsePerConnection}
      brainRegionSource="selected"
    />
  );
}
