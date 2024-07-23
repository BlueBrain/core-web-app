'use client';

import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { fetchResourceById } from '@/api/nexus';
import { getSession } from '@/authFetch';
import { EntityResource } from '@/types/nexus';
import Nav from '@/components/build-section/virtual-lab/me-model/Nav';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import useNotification from '@/hooks/notifications';
import {
  NeuronModelView,
  SynaptomeConfigurationForm,
} from '@/components/build-section/virtual-lab/synaptome';

type Props = {
  params: {
    projectId: string;
    virtualLabId: string;
  };
};

function useMeModel({ modelId }: { modelId: string }) {
  const [resource, setResource] = useState<EntityResource | null>(null);
  const [loading, setLoading] = useState(false);
  const { error: notifyError } = useNotification();

  useEffect(() => {
    let isAborted = false;
    (async () => {
      try {
        setLoading(true);
        const session = await getSession();
        if (!session) throw new Error('no session');
        const resourceObject = await fetchResourceById<EntityResource>(modelId, session);
        if (!isAborted) {
          setResource(resourceObject);
        }
      } catch (error) {
        notifyError('Error while loading the resource details', undefined, 'topRight');
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      isAborted = true;
    };
  }, [modelId, notifyError]);

  return { resource, loading };
}

function Synaptome({ params }: Props) {
  const { id } = useResourceInfoFromPath();
  const { resource, loading } = useMeModel({ modelId: id });

  if (loading || !resource) {
    return <Spin indicator={<LoadingOutlined />} />;
  }

  return (
    <div className="grid max-h-screen grid-cols-[min-content_auto] overflow-hidden bg-white">
      <Nav params={params} />
      <div className="grid w-full grid-cols-2">
        <div className="flex items-center justify-center bg-black">
          <DefaultLoadingSuspense>
            <NeuronModelView modelSelfUrl={resource._self} />
          </DefaultLoadingSuspense>
        </div>
        <div className="secondary-scrollbar h-screen w-full overflow-y-auto p-8">
          <SynaptomeConfigurationForm
            {...{
              resource,
              org: params.virtualLabId,
              project: params.projectId,
              resourceLoading: loading,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Synaptome;
