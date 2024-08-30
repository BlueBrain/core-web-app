import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import useSynaptomeModel from '../hooks/useSynaptomeModel';
import SimulationButton from '../molecules/SimulationButton';
import { SimulationConfiguration } from '../processSteps';
import { SimulationType } from '@/types/simulation/common';

type Props = {
  projectId: string;
  virtualLabId: string;
};

const SIMULATION_TYPE: SimulationType = 'synaptome-simulation';

export default function Synaptome({ projectId, virtualLabId }: Props) {
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
