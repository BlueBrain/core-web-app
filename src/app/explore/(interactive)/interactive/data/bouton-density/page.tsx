'use client';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { BOUTON_DENSITY } from '@/constants/explore-section/list-views';

export default function BoutonDensityListingPage() {
  return <ExploreSectionListingView experimentTypeName={BOUTON_DENSITY} brainRegionSource="data" />;
}
