'use client';

import { SimulationCampaignView } from '@/components/explore-section/ExploreSectionListingView';
import {
  experimentDataTypeAtom,
  triggerRefetchAtom,
  filtersAtom,
} from '@/state/explore-section/list-view-atoms';
import useListPage from '@/hooks/useListPage';
import { SIMULATION_CAMPAIGNS } from '@/constants/explore-section/list-views';

export default function SimulationCampaignPage() {
  useListPage({
    experimentDataTypeAtom,
    triggerRefetchAtom,
    filtersAtom,
    TYPE: SIMULATION_CAMPAIGNS,
  });

  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <SimulationCampaignView title="Simulation Campaigns" />
    </div>
  );
}
