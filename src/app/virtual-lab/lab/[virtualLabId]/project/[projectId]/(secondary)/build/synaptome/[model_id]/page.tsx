'use client';

import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import Nav from '@/components/build-section/virtual-lab/me-model/Nav';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import {
  NeuronModelView,
  SynaptomeConfigurationForm,
} from '@/components/build-section/virtual-lab/synaptome';
import { useMeModel } from '@/hooks/useMeModel';

type Props = {
  params: {
    projectId: string;
    virtualLabId: string;
  };
};

function Synaptome({ params }: Props) {
  const { id } = useResourceInfoFromPath();
  const { loading, resource } = useMeModel({ modelId: id });
  if (loading || !resource) {
    return <Spin indicator={<LoadingOutlined />} />;
  }

  return (
    <div className="grid max-h-screen grid-cols-[min-content_auto] overflow-hidden bg-white">
      <Nav params={params} />
      <div className="grid w-full grid-cols-2">
        <div className="flex items-center justify-center bg-black">
          <DefaultLoadingSuspense>
            <NeuronModelView modelSelfUrl={resource._self} />
          </DefaultLoadingSuspense>
        </div>
        <div className="secondary-scrollbar h-screen w-full overflow-y-auto p-8">
          <SynaptomeConfigurationForm
            {...{
              resource,
              org: params.virtualLabId,
              project: params.projectId,
              resourceLoading: loading,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Synaptome;
