'use client';

import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';

import { ParameterView } from '@/components/simulate/single-neuron';
import { useModel } from '@/hooks/useModel';
import { ModelResource } from '@/types/simulation/single-neuron';

import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import Wrapper from '@/components/simulate/single-neuron/Wrapper';

const NeuronViewerContainer = dynamic(
  () => import('@/components/neuron-viewer/NeuronViewerWithActions'),
  {
    ssr: false,
  }
);

type Props = {
  params: {
    projectId: string;
    virtualLabId: string;
  };
};

export default function SingleNeuronSimulation({ params: { projectId, virtualLabId } }: Props) {
  const { id } = useResourceInfoFromPath();
  const { resource, loading } = useModel<ModelResource>({
    modelId: id,
    org: virtualLabId,
    project: projectId,
  });

  if (loading || !resource) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3">
        <Spin indicator={<LoadingOutlined />} size="large" />
        <h2 className="font-light text-primary-9">Loading Configuration ...</h2>
      </div>
    );
  }

  return (
    <Wrapper
      viewer={<NeuronViewerContainer modelUrl={resource._self} />}
      type="single-neuron-simulation"
    >
      <ParameterView
        vlabId={virtualLabId}
        projectId={projectId}
        simResourceSelf={resource._self}
        modelSelf={resource._self}
        type="single-neuron-simulation"
      />
    </Wrapper>
  );
}
