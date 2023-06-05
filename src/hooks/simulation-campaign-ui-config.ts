'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAtom } from 'jotai';

import { idAtom as simCampUIConfigId } from '@/state/experiment-designer';
import { createId } from '@/util/nexus';

export default function useSimulationCampaignUIConfig() {
  const [currentSimCampUIConfigId, setSimCampUIConfigId] = useAtom(simCampUIConfigId);

  const searchParams = useSearchParams();
  const collapsedId = searchParams?.get('simulationCampaignUIConfigId');

  useEffect(() => {
    if (!collapsedId) return;

    const id = createId('simulationcampaignuiconfig', collapsedId);

    if (currentSimCampUIConfigId === id) return;

    setSimCampUIConfigId(id);
  }, [collapsedId, currentSimCampUIConfigId, setSimCampUIConfigId]);
}
