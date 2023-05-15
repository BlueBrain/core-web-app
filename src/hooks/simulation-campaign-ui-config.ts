'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAtom } from 'jotai';

import { idAtom } from '@/state/experiment-designer';
import { createId } from '@/util/nexus';

export default function useSimulationCampaignUIConfig() {
  const [currentId, setId] = useAtom(idAtom);

  const searchParams = useSearchParams();
  const collapsedId = searchParams?.get('simulationCampaignUIConfigId');

  useEffect(() => {
    if (!collapsedId) return;

    const id = createId('simulationcampaignuiconfig', collapsedId);

    if (currentId === id) return;

    setId(id);
  }, [collapsedId, currentId, setId]);
}
