'use client';

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

import Nav from '@/components/build-section/virtual-lab/me-model/Nav';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import Detail from '@/components/explore-section/Detail';
import ModelDetails from '@/components/simulate/SimulationDetails/MEModelDetails';
import ExperimentSetup from '@/components/simulate/SimulationDetails/ExperimentSetup';

import { MODEL_DATA_COMMON_FIELDS } from '@/constants/explore-section/detail-views-fields';
import { useSimulation } from '@/hooks/useSimulation';
import { backToListPathAtom } from '@/state/explore-section/detail-view-atoms';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';
import { LinkItemKey } from '@/constants/virtual-labs/sidemenu';
import { DeltaResource } from '@/types/explore-section/resources';
import { SingleNeuronSimulation, SynaptomeSimulation } from '@/types/nexus';
import { MEModelResource } from '@/types/me-model';
import { EModel, NeuronMorphology } from '@/types/e-model';

type Props = {
  params: {
    projectId: string;
    virtualLabId: string;
    simulationType: 'single-neuron-simulation' | 'synaptome-simulation';
  };
};

export type SimulationWithLinkedData = DeltaResource &
  (SynaptomeSimulation | SingleNeuronSimulation) & {
    linkedMeModel?: MEModelResource;
    linkedMModel?: NeuronMorphology;
    linkedEModel?: EModel;
  };

export default function SimulationDetailPage({ params }: Props) {
  const info = useResourceInfoFromPath();
  const setBackPath = useSetAtom(backToListPathAtom);

  const { simulationResource, simulationConfig, meModel, synaptomeModel } = useSimulation({
    modelId: info.id,
    org: params.virtualLabId,
    project: params.projectId,
    type: params.simulationType,
  });

  const vlProjectUrl = generateVlProjectUrl(params.virtualLabId, params.projectId);
  const baseBuildUrl = `${vlProjectUrl}/simulate`;
  useEffect(() => {
    setBackPath(baseBuildUrl);
  }, [baseBuildUrl, setBackPath]);

  if (!simulationResource) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-3">
        <Spin indicator={<LoadingOutlined />} size="large" />
        <h2 className="font-light text-primary-9">Loading simulation ...</h2>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[min-content_auto] overflow-hidden bg-white text-primary-8">
      <Nav
        params={params}
        extraLinks={[
          {
            key: LinkItemKey.Explore,
            href: `${vlProjectUrl}/explore`,
            content: 'Explore',
            styles: 'rounded-full bg-primary-5 py-3 text-primary-9 w-2/3',
          },
        ]}
      />
      <Detail
        fields={[]}
        commonFields={MODEL_DATA_COMMON_FIELDS}
        // extraHeaderAction={
        //   meModel &&
        //   simulationConfig && (
        //     <CloneSimulationButton
        //       synaptomeModelId={simulationResource.used['@id']}
        //       simulationConfig={simulationConfig}
        //       virtualLabId={params.virtualLabId}
        //       projectId={params.projectId}
        //     />
        //   )
        // }
      >
        {(data: SimulationWithLinkedData) => {
          return (
            <>
              {data.linkedMeModel && data.linkedMModel && data.linkedEModel ? (
                <ModelDetails
                  virtualLabId={params.virtualLabId}
                  projectId={params.projectId}
                  type={params.simulationType}
                  name={
                    params.simulationType === 'synaptome-simulation'
                      ? synaptomeModel?.name ?? ''
                      : data.linkedMeModel.name
                  }
                  meModel={data.linkedMeModel}
                  mModel={data.linkedMModel}
                  eModel={data.linkedEModel}
                />
              ) : (
                <Spin />
              )}
              {simulationConfig ? (
                <ExperimentSetup
                  type={params.simulationType}
                  experimentSetup={simulationConfig}
                  meModel={meModel}
                />
              ) : (
                <div className="flex h-full min-h-96 w-full flex-col items-center justify-center gap-3">
                  <Spin indicator={<LoadingOutlined />} size="large" />
                  <h2 className="font-light text-primary-9">
                    Loading simulation configuration ...
                  </h2>
                </div>
              )}
            </>
          );
        }}
      </Detail>
    </div>
  );
}
