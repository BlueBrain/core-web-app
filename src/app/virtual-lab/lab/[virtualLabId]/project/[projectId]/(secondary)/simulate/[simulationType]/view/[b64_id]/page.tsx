'use client';

import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { useSynaptomeSimulation } from '@/hooks/useSynapseSimulation';

import Nav from '@/components/build-section/virtual-lab/me-model/Nav';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import Detail from '@/components/explore-section/Detail';
import MEModelDetails from '@/components/simulate/SynaptomeSimulationDetails/MEModelDetails';
import ExperimentSetup from '@/components/simulate/SynaptomeSimulationDetails/ExperimentSetup';

type Params = {
  params: {
    projectId: string;
    virtualLabId: string;
    simulationType: string;
  };
};

export default function SynaptomeSimulationDetailPage({ params }: Params) {
  const info = useResourceInfoFromPath();

  const { simulationResource, simulationConfig, meModel } = useSynaptomeSimulation({
    modelId: info.id,
    org: params.virtualLabId,
    project: params.projectId,
  });

  if (!simulationResource) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3">
        <Spin indicator={<LoadingOutlined />} size="large" />
        <h2 className="font-light text-primary-9">Loading Synaptome Model ...</h2>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[min-content_auto] overflow-hidden bg-white text-primary-8">
      <Nav params={params} />
      <Detail fields={[]}>
        {() => (
          <div>
            {meModel ? <MEModelDetails meModel={meModel} /> : <Spin />}
            {simulationConfig ? (
              <ExperimentSetup experimentSetup={simulationConfig} />
            ) : (
              <Spin className="mt-6" />
            )}
          </div>
        )}
      </Detail>
    </div>
  );
}
