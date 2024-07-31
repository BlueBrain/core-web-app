'use client';

import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { Title, StepTabs, Visualization, ParameterView } from '@/components/simulate/single-neuron';
import LaunchButton from '@/components/simulate/single-neuron/parameters/LaunchButton';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import { useMeModel } from '@/hooks/useMeModel';

type Props = {
  params: {
    projectId: string;
    virtualLabId: string;
  };
};

export default function VirtualLabSimulationPage({ params }: Props) {
  const { id } = useResourceInfoFromPath();
  const { resource, loading } = useMeModel({ modelId: id });

  if (loading || !resource) {
    return <Spin indicator={<LoadingOutlined />} />;
  }

  return (
    <>
      <Title />
      <StepTabs />
      <div className="flex h-[calc(100vh-72px)]">
        <div className="flex w-1/2 items-center justify-center bg-black">
          <Visualization resource={resource} />
        </div>
        <div className="flex w-1/2">
          <ParameterView resource={resource} />
        </div>
      </div>
      <LaunchButton
        modelSelfUrl={resource._self}
        projectId={params.projectId}
        vLabId={params.virtualLabId}
      />
    </>
  );
}
