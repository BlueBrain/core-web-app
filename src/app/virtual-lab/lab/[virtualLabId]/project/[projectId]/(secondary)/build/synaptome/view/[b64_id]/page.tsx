'use client';

import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Nav from '@/components/build-section/virtual-lab/me-model/Nav';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import { useModel } from '@/hooks/useModel';
import { ModelResource } from '@/types/simulation/single-neuron';

type Params = {
  params: {
    projectId: string;
    virtualLabId: string;
  };
};

export default function SynaptomeModelDetailPage({ params }: Params) {
  const info = useResourceInfoFromPath();

  const { resource, loading } = useModel<ModelResource>({
    modelId: info.id,
    org: params.virtualLabId,
    project: params.projectId,
  });

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
      <div className="secondary-scrollbar h-screen w-full overflow-y-auto p-10">
        <div>
          <span className="mx-8 text-gray-400">Name:</span>
          <span className="font-bold text-primary-8">{resource.name}</span>
        </div>
      </div>
    </div>
  );
}
