'use client';

import { useEffect, useState } from 'react';
import NeuronModelViewer from './NeuronModelViewer';

import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import { EntityResource } from '@/types/nexus';

const baseBannerStyle =
  'flex h-full items-center justify-center text-4xl bg-gray-950 text-gray-100';

type Props = {
  resource: EntityResource;
};

export default function EModelInteractiveView({ resource }: Props) {
  const [blueNaasModelSelfUrl, setBlueNaasModelSelfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const init = () => {
      setLoading(true);
      setBlueNaasModelSelfUrl(resource?._self ?? null);
    };

    init();

    return () => {
      setBlueNaasModelSelfUrl(null);
    };
  }, [resource]);

  if (!blueNaasModelSelfUrl) {
    const msg = loading ? 'Loading...' : 'Select a leaf region and an already built E-Model';

    return <div className={baseBannerStyle}>{msg}</div>;
  }

  return (
    <DefaultLoadingSuspense>
      <NeuronModelViewer modelSelfUrl={blueNaasModelSelfUrl} />
    </DefaultLoadingSuspense>
  );
}
