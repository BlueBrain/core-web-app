import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useSetAtom } from 'jotai';

import useSynaptomeModel from '../hooks/useSynaptomeModel';
import SimulationButton from '../molecules/SimulationButton';
import { SimulationConfiguration } from '../processSteps';
import { SimulationType } from '@/types/simulation/common';
import { useSynaptomeSimulationConfig } from '@/state/simulate/categories';
import { SynaptomeSimulationInstanceAtom } from '@/state/simulate/categories/simulation-model';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';

type Props = {
  projectId: string;
  virtualLabId: string;
};

const SIMULATION_TYPE: SimulationType = 'synaptome-simulation';

export default function Synaptome({ projectId, virtualLabId }: Props) {
  const { id } = useResourceInfoFromPath();
  const bootstrapSimulationContext = useSetAtom(SynaptomeSimulationInstanceAtom);
  const { newConfig } = useSynaptomeSimulationConfig();

  const { model, configuration } = useSynaptomeModel({
    projectId,
    virtualLabId,
    modelId: id,
    callback: (m, c) => {
      bootstrapSimulationContext({ model: m, configuration: c });
      newConfig(c.synapses);
    },
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
    <>
      <SimulationConfiguration meModelUrl={configuration.meModelSelf} type={SIMULATION_TYPE} />
      <div className="fixed bottom-4 right-4 z-20 mt-auto">
        <SimulationButton
          modelSelfUrl={model._self}
          vLabId={virtualLabId}
          projectId={projectId}
          simulationType={SIMULATION_TYPE}
        />
      </div>
    </>
  );
}
