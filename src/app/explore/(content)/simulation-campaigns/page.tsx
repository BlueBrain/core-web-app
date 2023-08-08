'use client';

import { SimulationCampaignView } from '@/components/explore-section/ExploreSectionListingView';
import { typeAtom, triggerRefetchAtom, filtersAtom } from '@/state/explore-section/list-view-atoms';
import useListPage from '@/hooks/useListPage';

const TYPE = 'https://neuroshapes.org/SimulationCampaign';

export default function SimulationCampaignPage() {
  useListPage({ typeAtom, triggerRefetchAtom, filtersAtom, TYPE });

  return (
    <div className="flex min-h-screen" style={{ background: '#d1d1d1' }}>
      <SimulationCampaignView title="Simulation Campaigns" />
    </div>
  );
}
