'use client';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { LAYER_THICKNESS } from '@/constants/explore-section/list-views';

export default function LayerThicknessListingPage() {
  return (
    <ExploreSectionListingView
      title="Layer Thickness"
      experimentTypeName={LAYER_THICKNESS}
      brainRegionSource="visible"
    />
  );
}
