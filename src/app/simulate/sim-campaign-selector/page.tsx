'use client';

import { PlusOutlined } from '@ant-design/icons';

import Link from '@/components/Link';
import SimCampaignList from '@/components/simulate/SimCampaignList';
import LaunchedSimCampaignList from '@/components/simulate/LaunchedSimCampaignList';

export default function SimulationCampaignSelectorPage() {
  return (
    <>
      <Link href="/simulate/brain-config-selector">
        <button type="button" className="flex justify-between items-center p-8 bg-primary-8">
          <div className="mr-9 items-start flex-col flex">
            <div className="font-bold text-2xl">Create new simulation campaign configuration</div>
            <div className="mt-3 text-primary-3">Description</div>
          </div>
          <PlusOutlined />
        </button>
      </Link>

      <LaunchedSimCampaignList />
      <SimCampaignList />
    </>
  );
}
