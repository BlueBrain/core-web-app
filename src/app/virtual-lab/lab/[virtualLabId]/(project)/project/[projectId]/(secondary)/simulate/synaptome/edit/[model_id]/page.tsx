'use client';

import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { Title, StepTabs, ParameterView } from '@/components/simulate/single-neuron';
import LaunchButton from '@/components/simulate/single-neuron/parameters/LaunchButton';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import { useModel } from '@/hooks/useMeModel';
import { getSession } from '@/authFetch';
import { fetchJsonFileByUrl } from '@/api/nexus';
import { SynaptomeConfigDistribution } from '@/types/synaptome';
import { isSynaptomModel } from '@/types/simulate/single-neuron';
import useNotification from '@/hooks/notifications';
import { NeuronModelView } from '@/components/build-section/virtual-lab/synaptome';

type Props = {
  params: {
    projectId: string;
    virtualLabId: string;
  };
};

export default function VirtualLabSimulationPage({ params }: Props) {
  const [synaptomeConfig, setSynaptomeConfig] = useState<null | SynaptomeConfigDistribution>(null);

  const { id } = useResourceInfoFromPath();
  const { error: notifyError } = useNotification();

  const { resource: synaptomeModel } = useModel({
    modelId: id,
    org: params.virtualLabId,
    project: params.projectId,
  });

  useEffect(() => {
    if (!synaptomeModel || !isSynaptomModel(synaptomeModel)) {
      return;
    }
    let isAborted = false;
    (async () => {
      try {
        const session = await getSession();
        if (!session) throw new Error('no session');
        const resourceObject = await fetchJsonFileByUrl<SynaptomeConfigDistribution>(
          synaptomeModel.distribution.contentUrl,
          session
        );
        if (!isAborted) {
          setSynaptomeConfig(resourceObject);
        }
      } catch (error) {
        notifyError('Error while loading the resource details', undefined, 'topRight');
      }
    })();
    return () => {
      isAborted = true;
    };
  }, [synaptomeModel, notifyError]);

  if (!synaptomeConfig || !synaptomeModel) {
    return <Spin indicator={<LoadingOutlined />} />;
  }

  return (
    <>
      <Title />
      <StepTabs />
      <div className="flex h-[calc(100vh-72px)]">
        <div className="flex w-1/2 items-center justify-center bg-black">
          <NeuronModelView modelSelfUrl={synaptomeConfig.meModelSelf} />
        </div>
        <div className="flex w-1/2">
          {synaptomeConfig && synaptomeModel ? (
            <ParameterView resource={synaptomeModel} synaptomeConfig={synaptomeConfig} />
          ) : (
            <Spin indicator={<LoadingOutlined />} />
          )}
        </div>
      </div>
      <LaunchButton
        modelSelfUrl={synaptomeModel?._self}
        projectId={params.projectId}
        vLabId={params.virtualLabId}
      />
    </>
  );
}
