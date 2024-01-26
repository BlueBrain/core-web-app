'use client';

import DefaultListView from '@/components/explore-section/ExploreSectionListingView';
import { DataType } from '@/constants/explore-section/list-views';

export default function MorphologyListingPage() {
  return (
    <DefaultListView
      enableDownload
      dataType={DataType.ExperimentalNeuronMorphology}
      brainRegionSource="selected"
    />
  );
}
