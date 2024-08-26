'use client';

import { useEffect, useRef } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useSetAtom } from 'jotai';

import { ParameterView } from '@/components/simulate/single-neuron';
import { useModel } from '@/hooks/useModel';
import { SynaptomeModelResource } from '@/types/explore-section/delta-model';
import { useModelConfiguration } from '@/hooks/useModelConfiguration';
import { SynaptomeSimulationInstanceAtom } from '@/state/simulate/categories/simulation-model';
import { SynaptomeConfigDistribution } from '@/types/synaptome';

import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import useSynaptomeSimulationConfig from '@/state/simulate/categories/synaptome-simulation-config';
import Wrapper from '@/components/simulate/single-neuron/Wrapper';
import NeuronViewerContainer from '@/components/neuron-viewer/NeuronViewerWithActions';

type Props = {
  params: {
    projectId: string;
    virtualLabId: string;
  };
};

function useSynaptomeModel({
  virtualLabId,
  projectId,
}: {
  projectId: string;
  virtualLabId: string;
}) {
  const { id } = useResourceInfoFromPath();
  const settedRef = useRef(false);
  const bootstrapSimulationContext = useSetAtom(SynaptomeSimulationInstanceAtom);

  const { newConfig } = useSynaptomeSimulationConfig();
  const { resource: model } = useModel<SynaptomeModelResource>({
    modelId: id,
    org: virtualLabId,
    project: projectId,
  });

  const { configuration } = useModelConfiguration<SynaptomeConfigDistribution>({
    contentUrl: model?.distribution.contentUrl,
  });

  useEffect(() => {
    if (model && configuration && !settedRef.current) {
      bootstrapSimulationContext({ model, configuration });
      newConfig(configuration.synapses);
      settedRef.current = true;
    }
  }, [configuration, model, newConfig, bootstrapSimulationContext]);

  return {
    model,
    configuration,
  };
}

export default function SynaptomeSimulation({ params: { virtualLabId, projectId } }: Props) {
  const { model, configuration } = useSynaptomeModel({
    projectId,
    virtualLabId,
  });

  if (!model || !configuration) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3">
        <Spin indicator={<LoadingOutlined />} size="large" />
        <h2 className="font-light text-primary-9">Loading Configuration ...</h2>
      </div>
    );
  }

  return (
    <Wrapper
      viewer={<NeuronViewerContainer modelUrl={configuration.meModelSelf} />}
      type="synaptome-simulation"
    >
      <ParameterView
        vlabId={virtualLabId}
        projectId={projectId}
        simResourceSelf={model._self}
        modelSelf={configuration.meModelSelf}
        type="synaptome-simulation"
      />
    </Wrapper>
  );
}
