'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAtom } from 'jotai';

import { idAtom as simCampUIConfigId } from '@/state/experiment-designer';
import { expandId } from '@/util/nexus';

export default function useSimulationCampaignUIConfig() {
  const [currentSimCampUIConfigId, setSimCampUIConfigId] = useAtom(simCampUIConfigId);

  const searchParams = useSearchParams();
  const collapsedId = searchParams?.get('simulationCampaignUIConfigId');
  const id = collapsedId ? expandId(collapsedId) : null;

  useEffect(() => {
    if (!id) return;

    if (currentSimCampUIConfigId === id) return;

    setSimCampUIConfigId(id);
  }, [id, currentSimCampUIConfigId, setSimCampUIConfigId]);
}
