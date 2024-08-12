'use client';

import { useEffect, useMemo, useRef } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useAtomValue, useSetAtom } from 'jotai';

import { ParameterView } from '@/components/simulate/single-neuron';
import { NeuronModelView } from '@/components/build-section/virtual-lab/synaptome';
import { useModel } from '@/hooks/useModel';
import { SynaptomeModelResource } from '@/types/explore-section/delta-model';
import { useModelConfiguration } from '@/hooks/useModelConfiguration';
import { SynaptomeSimulationInstanceAtom } from '@/state/simulate/categories/simulation-model';
import { SynaptomeConfigDistribution } from '@/types/synaptome';
import { SimulationConfiguration } from '@/types/simulation/single-neuron';
import { DEFAULT_RECORD_SOURCE } from '@/state/simulate/categories/recording-source-for-simulation';
import { useDirectCurrentInjectionSimulationConfig } from '@/state/simulate/categories';

import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import useSynaptomeSimulationConfig from '@/state/simulate/categories/synaptome-simulation-config';
import ModelWithSynapseConfig from '@/components/simulate/single-neuron/parameters/ModelWithSynapseConfig';
import Wrapper from '@/components/simulate/single-neuron/Wrapper';

type Props = {
  params: {
    projectId: string;
    virtualLabId: string;
  };
};

function MorphologyViewer() {
  const { configuration } = useAtomValue(SynaptomeSimulationInstanceAtom);

  if (!configuration) return null;

  return (
    <DefaultLoadingSuspense>
      <NeuronModelView modelSelfUrl={configuration.meModelSelf} />
    </DefaultLoadingSuspense>
  );
}

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
  const { state: directCurrentConfig } = useDirectCurrentInjectionSimulationConfig();
  const { state: synaptomeConfig } = useSynaptomeSimulationConfig();
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

  const initialValues: SimulationConfiguration = useMemo(() => {
    return {
      recordFrom: [DEFAULT_RECORD_SOURCE],
      directStimulation: directCurrentConfig,
      synapses: synaptomeConfig,
    };
  }, [directCurrentConfig, synaptomeConfig]);

  return {
    model,
    configuration,
    initialValues,
  };
}

export default function SynaptomeSimulation({ params: { virtualLabId, projectId } }: Props) {
  const { model, configuration, initialValues } = useSynaptomeModel({
    projectId,
    virtualLabId,
  });

  if (!model || !configuration) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3">
        <Spin indicator={<LoadingOutlined />} />
        <h2 className="font-bold text-primary-9">Loading Configuration</h2>
      </div>
    );
  }

  return (
    <Wrapper viewer={<MorphologyViewer />}>
      <ParameterView
        initialValues={initialValues}
        vlabId={virtualLabId}
        projectId={projectId}
        simResourceSelf={model._self}
        type="synaptome-simulation"
      >
        <ModelWithSynapseConfig />
      </ParameterView>
    </Wrapper>
  );
}
