'use client';

import { Spin } from 'antd';
import { Suspense, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';

import Link from 'next/link';
import {
  MODEL_DATA_COMMON_FIELDS,
  SYNATOME_MODEL_FIELDS,
} from '@/constants/explore-section/detail-views-fields';
import { MEModelConfiguration } from '@/components/build-section/virtual-lab/synaptome/view-model/MEModelConfig';
import { SynaptomeModelResource } from '@/types/explore-section/delta-model';
import { classNames } from '@/util/utils';

import Results from '@/components/build-section/virtual-lab/synaptome/view-model/Results';
import SynapseGroupList from '@/components/build-section/virtual-lab/synaptome/view-model/ListSynapses';
import useSynaptomeModel from '@/components/simulate/single-neuron/hooks/useSynaptomeModel';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import Detail from '@/components/explore-section/Detail';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';
import {
  DataTypeToNewSimulationPage,
  DataTypeToNexusType,
} from '@/constants/explore-section/list-views';
import { to64 } from '@/util/common';

type Props = {
  params: {
    projectId: string;
    virtualLabId: string;
  };
};

type TabKeys = 'synaptome-configuration' | 'synaptome-simulation';
type Tab = { key: TabKeys; title: string };

const TABS: Tab[] = [
  {
    key: 'synaptome-configuration',
    title: 'Configuration',
  },
  {
    key: 'synaptome-simulation',
    title: 'Simulation',
  },
];

export default function SynaptomeModelDetailPage({ params: { virtualLabId, projectId } }: Props) {
  const info = useResourceInfoFromPath();
  const [activeTab, setActiveTab] = useState<TabKeys>('synaptome-configuration');

  const { model, configuration, loading } = useSynaptomeModel({
    modelId: info.id,
    virtualLabId,
    projectId,
  });

  if (loading || !model || !configuration) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-3">
        <Spin indicator={<LoadingOutlined />} size="large" />
        <h2 className="font-light text-primary-9">Loading synaptome model...</h2>
      </div>
    );
  }

  const getSimulationId = (synaptomeModelId: string) => {
    const vlProjectUrl = generateVlProjectUrl(virtualLabId, projectId);
    const basePath = `${vlProjectUrl}/simulate/${DataTypeToNewSimulationPage[DataTypeToNexusType.SingleNeuronSynaptome]}/new`;
    return `${basePath}/${to64(`${projectId}!/!${synaptomeModelId}`)}`;
  };

  return (
    <div className="secondary-scrollbar h-screen w-full overflow-y-auto">
      <Suspense fallback={<CentralLoadingSpinner />}>
        <Detail
          showViewMode
          fields={SYNATOME_MODEL_FIELDS}
          commonFields={MODEL_DATA_COMMON_FIELDS}
          extraHeaderAction={
            model && (
              <Link
                className="flex h-11 items-center gap-2 rounded-none border border-gray-300 px-8 shadow-none"
                href={getSimulationId(model['@id'])}
              >
                Simulate
              </Link>
            )
          }
        >
          {(data: SynaptomeModelResource) => {
            return (
              <div>
                <ul className="mt-8 flex w-full items-center justify-center">
                  {TABS.map(({ key, title }) => (
                    <li
                      title={title}
                      key={key}
                      className={classNames(
                        'w-1/3 flex-[1_1_33%] border py-3 text-center text-xl font-semibold transition-all duration-200 ease-out',
                        activeTab === key ? 'bg-primary-9 text-white' : 'bg-white text-primary-9'
                      )}
                    >
                      <button
                        type="button"
                        className="w-full"
                        onClick={() => setActiveTab(key)}
                        onKeyDown={() => setActiveTab(key)}
                      >
                        {title}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 w-full">
                  {activeTab === 'synaptome-configuration' && (
                    <div className="flex w-full flex-col gap-4">
                      {data.linkedMeModel && data.linkedMModel && data.linkedEModel && (
                        <MEModelConfiguration
                          {...{
                            virtualLabId,
                            projectId,
                            meModel: data.linkedMeModel,
                            mModel: data.linkedMModel,
                            eModel: data.linkedEModel,
                          }}
                        />
                      )}
                      <div className="mt-10">
                        <SynapseGroupList modelUrl={data.distribution.contentUrl} />
                      </div>
                    </div>
                  )}
                  {activeTab === 'synaptome-simulation' && (
                    <Results params={{ virtualLabId, projectId }} modelId={info.id} />
                  )}
                </div>
              </div>
            );
          }}
        </Detail>
      </Suspense>
    </div>
  );
}
