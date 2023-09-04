'use client';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { SYNAPSE_PER_CONNECTION } from '@/constants/explore-section/list-views';

export default function SynapsePerConnectionListingPage() {
  return <ExploreSectionListingView title="Synapse per connection" type={SYNAPSE_PER_CONNECTION} />;
}
