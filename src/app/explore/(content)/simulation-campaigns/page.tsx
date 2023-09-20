'use client';

import SimulationCampaignListView from '@/components/explore-section/ExploreSectionListingView/SimulationCampaignListView';
import { SIMULATION_CAMPAIGNS } from '@/constants/explore-section/list-views';

export default function SimulationCampaignPage() {
  return (
    <SimulationCampaignListView
      title="Simulation Campaigns"
      experimentTypeName={SIMULATION_CAMPAIGNS}
    />
  );
}
