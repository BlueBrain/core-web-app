'use client';

import { useEffect, useState } from 'react';
import { BlueNaas } from '@/components/simulate/single-neuron/visualization/View';
import { fetchResourceById } from '@/api/nexus';
import { getSession } from '@/authFetch';
import { EntityResource } from '@/types/nexus';
import Nav from '@/components/build-section/virtual-lab/me-model/Nav';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import SynaptomeConfigurationForm from '@/components/build-section/virtual-lab/synaptome/SynaptomeConfigurationForm';

type Props = {
  params: {
    projectId: string;
    virtualLabId: string;
  };
};

function useMeModel({ modelId }: { modelId: string }) {
  const [resource, setResource] = useState<EntityResource | null>(null);
  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (!session) throw new Error('no session');
      const resourceObject = await fetchResourceById<EntityResource>(modelId, session);
      setResource(resourceObject);
    })();
  }, [modelId]);

  return { resource };
}

function Synaptome({ params }: Props) {
  const { id } = useResourceInfoFromPath();
  const { resource } = useMeModel({ modelId: id });

  if (!resource) {
    const msg = 'Loading...';

    return (
      <div className="flex h-full items-center justify-center bg-gray-950 text-4xl text-gray-100">
        {msg}
      </div>
    );
  }

  return (
    <div className="grid max-h-screen grid-cols-[min-content_auto] overflow-hidden bg-white">
      <Nav params={params} />
      <div className="grid w-full grid-cols-2">
        <div className="flex items-center justify-center bg-black">
          <DefaultLoadingSuspense>
            <BlueNaas modelSelfUrl={resource._self} />
          </DefaultLoadingSuspense>
        </div>
        <div className="secondary-scrollbar h-screen w-full overflow-y-auto p-8">
          <SynaptomeConfigurationForm
            {...{
              resource,
              org: params.virtualLabId,
              project: params.projectId,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Synaptome;
