'use client';

import SimulationCampaignListView from '@/components/explore-section/ExploreSectionListingView/SimulationCampaignListView';
import { DataType } from '@/constants/explore-section/list-views';

export default function SimulationCampaignPage() {
  return <SimulationCampaignListView dataType={DataType.SimulationCampaigns} />;
}
