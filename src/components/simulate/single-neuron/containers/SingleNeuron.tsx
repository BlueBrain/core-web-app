import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

import SimulationButton from '../molecules/SimulationButton';
import { SimulationConfiguration } from '../processSteps';
import { useModel } from '@/hooks/useModel';
import { ModelResource } from '@/types/simulation/single-neuron';
import { SimulationType } from '@/types/simulation/common';

import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';

type Props = {
  projectId: string;
  virtualLabId: string;
  disableForm: boolean;
};

const SIMULATION_TYPE: SimulationType = 'single-neuron-simulation';

function SingleNeuron({ projectId, virtualLabId, disableForm }: Props) {
  const { id: modelId } = useResourceInfoFromPath();
  const { resource, loading } = useModel<ModelResource>({
    modelId,
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
    <>
      <SimulationConfiguration meModelUrl={resource._self} type={SIMULATION_TYPE} />
      <div className="fixed bottom-4 right-4 z-20 mt-auto">
        <SimulationButton
          modelSelfUrl={resource._self}
          vLabId={virtualLabId}
          projectId={projectId}
          simulationType={SIMULATION_TYPE}
          disabled={disableForm}
        />
      </div>
    </>
  );
}

export default SingleNeuron;
