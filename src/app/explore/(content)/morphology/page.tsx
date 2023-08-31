'use client';

import DefaultListView from '@/components/explore-section/ExploreSectionListingView';
import { NEURON_MORPHOLOGY } from '@/constants/explore-section/list-views';

export default function MorphologyListingPage() {
  return <DefaultListView enableDownload title="Neuron morphology" type={NEURON_MORPHOLOGY} />;
}
