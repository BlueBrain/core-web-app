'use client';

import { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';

import SearchInput from './SearchInput';
import { SimulationCampaignUIConfigResource } from '@/types/nexus';
import { simCampaingListAtom } from '@/state/experiment-designer';
import ConfigList from '@/components/ConfigList';

const loadableSimCampaignListAtom = loadable(simCampaingListAtom);

export default function SimCampaignList() {
  const simCampaignsLoadable = useAtomValue(loadableSimCampaignListAtom);

  const [configs, setConfigs] = useState<SimulationCampaignUIConfigResource[]>([]);

  useEffect(() => {
    if (simCampaignsLoadable.state !== 'hasData') return;

    setConfigs(simCampaignsLoadable.data);
  }, [simCampaignsLoadable]);

  return (
    <>
      <div className="flex justify-end mb-3">
        <SearchInput />
      </div>

      <ConfigList<SimulationCampaignUIConfigResource>
        isLoading={simCampaignsLoadable.state === 'loading'}
        configs={configs}
      />
    </>
  );
}
