'use client';

import { Spin } from 'antd';
import { useSetAtom } from 'jotai';
import { Suspense, useEffect } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import Link from 'next/link';

import { useModel } from '@/hooks/useModel';
import { ModelResource } from '@/types/simulation/single-neuron';
import {
  MODEL_DATA_COMMON_FIELDS,
  SYNATOME_MODEL_FIELDS,
} from '@/constants/explore-section/detail-views-fields';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';
import { backToListPathAtom } from '@/state/explore-section/detail-view-atoms';
import { SynaptomeModelResource } from '@/types/explore-section/delta-model';

import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import Nav from '@/components/build-section/virtual-lab/me-model/Nav';
import Detail from '@/components/explore-section/Detail';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import SynapseGroupList from '@/components/build-section/virtual-lab/synaptome/view-model/ListSynapses';
import { to64 } from '@/util/common';
import CloneIcon from '@/components/icons/Clone';

type Params = {
  params: {
    projectId: string;
    virtualLabId: string;
  };
};

export default function SynaptomeModelDetailPage({ params }: Params) {
  const info = useResourceInfoFromPath();
  const vlProjectUrl = generateVlProjectUrl(params.virtualLabId, params.projectId);
  const baseBuildUrl = `${vlProjectUrl}/build/synaptome/new`;
  const { resource, loading } = useModel<ModelResource>({
    modelId: info.id,
    org: params.virtualLabId,
    project: params.projectId,
  });

  const setBackToListPath = useSetAtom(backToListPathAtom);

  useEffect(() => {
    setBackToListPath(`${vlProjectUrl}/build`);
  }, [setBackToListPath, vlProjectUrl]);

  if (loading || !resource) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3">
        <Spin indicator={<LoadingOutlined />} size="large" />
        <h2 className="font-light text-primary-9">Loading Synaptome Model ...</h2>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-[min-content_auto] overflow-hidden bg-white">
      <Nav params={params} />
      <div className="secondary-scrollbar h-screen w-full overflow-y-auto">
        <Suspense fallback={<CentralLoadingSpinner />}>
          <Detail
            showViewMode
            withRevision
            fields={SYNATOME_MODEL_FIELDS}
            commonFields={MODEL_DATA_COMMON_FIELDS}
            extraHeaderAction={
              <Link
                className="flex items-center gap-2 text-primary-7 hover:!bg-transparent"
                href={`${baseBuildUrl}?mode=clone&model=${to64(info.id)}`}
              >
                <div className="flex items-center justify-center gap-2">
                  Clone model
                  <div className="h-auto w-12 border border-neutral-2 px-4 py-3">
                    <CloneIcon />
                  </div>
                </div>
              </Link>
            }
          >
            {(data: SynaptomeModelResource) => {
              return (
                <div className="mt-4">
                  <SynapseGroupList modelUrl={data.distribution.contentUrl} />
                </div>
              );
            }}
          </Detail>
        </Suspense>
      </div>
    </div>
  );
}
