'use client';

import { Spin } from 'antd';
import { useSetAtom } from 'jotai';
import { Suspense, useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';

import {
  MODEL_DATA_COMMON_FIELDS,
  SYNATOME_MODEL_FIELDS,
} from '@/constants/explore-section/detail-views-fields';
import { MEModelConfiguration } from '@/components/build-section/virtual-lab/synaptome/view-model/MEModelConfig';
import { backToListPathAtom } from '@/state/explore-section/detail-view-atoms';
import { SynaptomeModelResource } from '@/types/explore-section/delta-model';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';
import { classNames } from '@/util/utils';

import Results from '@/components/build-section/virtual-lab/synaptome/view-model/Results';
import SynapseGroupList from '@/components/build-section/virtual-lab/synaptome/view-model/ListSynapses';
import useSynaptomeModel from '@/components/simulate/single-neuron/hooks/useSynaptomeModel';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import Nav from '@/components/build-section/virtual-lab/me-model/Nav';
import Detail from '@/components/explore-section/Detail';

type Params = {
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

export default function SynaptomeModelDetailPage({ params: { virtualLabId, projectId } }: Params) {
  const info = useResourceInfoFromPath();
  const [activeTab, setActiveTab] = useState<TabKeys>('synaptome-configuration');
  const vlProjectUrl = generateVlProjectUrl(virtualLabId, projectId);

  const { model, configuration, loading } = useSynaptomeModel({
    modelId: info.id,
    virtualLabId,
    projectId,
  });

  const setBackToListPath = useSetAtom(backToListPathAtom);

  useEffect(() => {
    setBackToListPath(`${vlProjectUrl}/build`);
  }, [setBackToListPath, vlProjectUrl]);

  if (loading || !model || !configuration) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-3">
        <Spin indicator={<LoadingOutlined />} size="large" />
        <h2 className="font-light text-primary-9">Loading Synaptome model...</h2>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[min-content_auto] overflow-hidden bg-white">
      <Nav params={{ projectId, virtualLabId }} />
      <div className="secondary-scrollbar h-screen w-full overflow-y-auto">
        <Suspense fallback={<CentralLoadingSpinner />}>
          <Detail
            showViewMode
            withRevision
            fields={SYNATOME_MODEL_FIELDS}
            commonFields={MODEL_DATA_COMMON_FIELDS}
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
                      <MEModelConfiguration
                        {...{ virtualLabId, projectId, meModelId: model.used['@id'] }}
                      />
                    )}
                    {activeTab === 'synaptome-simulation' && (
                      <Results params={{ virtualLabId, projectId }} modelId={info.id} />
                    )}
                  </div>

                  <div className="mt-10">
                    <SynapseGroupList modelUrl={data.distribution.contentUrl} />
                  </div>
                </div>
              );
            }}
          </Detail>
        </Suspense>
      </div>
    </div>
  );
}
