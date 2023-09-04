'use client';

import { PlusOutlined } from '@ant-design/icons';

import Link from '@/components/Link';
import { LaunchedSimCampaignList, SimCampUIConfigTemplateGrid } from '@/components/simulate';
import { WideButton } from '@/components/simulate/sim-campaign-selector';
import { EyeIcon } from '@/components/icons';

export default function SimulationCampaignSelectorPage() {
  return (
    <>
      <div className="flex flex-col gap-6">
        <Link href="/explore/simulation-campaigns">
          <WideButton
            title="Browse simulation experiments"
            description="Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            icon={<EyeIcon />}
            className="bg-primary-7 text-white"
          />
        </Link>

        <Link href="/simulate/brain-config-selector">
          <WideButton
            title="Create new simulation experiment"
            description="Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            icon={<PlusOutlined />}
            className="bg-primary-8"
          />
        </Link>
      </div>

      <div className="py-5 text-primary-2 text-lg">Or use one of our templates:</div>

      <div id="simulate-templates">
        <SimCampUIConfigTemplateGrid />
      </div>

      <span id="simulate-runs">
        <LaunchedSimCampaignList />
      </span>
    </>
  );
}
