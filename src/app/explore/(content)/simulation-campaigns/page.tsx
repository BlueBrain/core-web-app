'use client';

import { SimulationCampaignView } from '@/components/explore-section/ExploreSectionListingView';
import { SIMULATION_CAMPAIGNS } from '@/constants/explore-section/list-views';

export default function SimulationCampaignPage() {
  return <SimulationCampaignView title="Simulation Campaigns" type={SIMULATION_CAMPAIGNS} />;
}
