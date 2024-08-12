'use client';

import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

import { ParameterView } from '@/components/simulate/single-neuron';
import { useModel } from '@/hooks/useModel';
import { ModelResource, SimulationConfiguration } from '@/types/simulation/single-neuron';
import { DEFAULT_RECORD_SOURCE } from '@/state/simulate/categories/recording-source-for-simulation';
import { DEFAULT_DIRECT_STIM_CONFIG } from '@/constants/simulate/single-neuron';
import { NeuronModelView } from '@/components/build-section/virtual-lab/synaptome';

import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import Stimulation from '@/components/simulate/single-neuron/parameters/Stimulation';
import Wrapper from '@/components/simulate/single-neuron/Wrapper';

type Props = {
  params: {
    projectId: string;
    virtualLabId: string;
  };
};

function MorphologyViewer({ modelUrl }: { modelUrl?: string }) {
  if (!modelUrl) return null;

  return (
    <DefaultLoadingSuspense>
      <NeuronModelView modelSelfUrl={modelUrl} />
    </DefaultLoadingSuspense>
  );
}

export default function SingleNeuronSimulation({ params: { projectId, virtualLabId } }: Props) {
  const { id } = useResourceInfoFromPath();
  const { resource, loading } = useModel<ModelResource>({ modelId: id });

  const initialValues: SimulationConfiguration = {
    recordFrom: [DEFAULT_RECORD_SOURCE],
    directStimulation: [DEFAULT_DIRECT_STIM_CONFIG],
    synapses: null,
  };

  if (loading || !resource) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3">
        <Spin indicator={<LoadingOutlined />} />
        <h2 className="font-bold text-primary-9">Loading Configuration</h2>
      </div>
    );
  }

  return (
    <Wrapper viewer={<MorphologyViewer modelUrl={resource._self} />}>
      <ParameterView
        initialValues={initialValues}
        vlabId={virtualLabId}
        projectId={projectId}
        simResourceSelf={resource._self}
        type="single-neuron-simulation"
      >
        <Stimulation modelSelfUrl={resource._self} />
      </ParameterView>
    </Wrapper>
  );
}
