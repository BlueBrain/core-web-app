'use client';

import { Form, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { SynaptomeConfigurationForm } from '../molecules';
import { MEModelResource } from '@/types/me-model';
import { useModel } from '@/hooks/useModel';

import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import NeuronViewer from '@/components/neuron-viewer';

type Props = {
  projectId: string;
  virtualLabId: string;
};

function SynaptomeConfiguration({ virtualLabId, projectId }: Props) {
  const { getFieldValue } = Form.useFormInstance();

  const { loading, resource } = useModel<MEModelResource>({
    modelId: getFieldValue('modelUrl'),
    org: virtualLabId,
    project: projectId,
  });

  if (loading || !resource) {
    return (
      <div>
        <div className="flex h-[calc(100vh-51px)] w-full flex-col items-center justify-center gap-3">
          <Spin indicator={<LoadingOutlined />} size="large" />
          <h2 className="font-light text-primary-9">Loading Model ...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-[calc(100vh-51px)] w-full grid-cols-2">
      <div className="flex items-center justify-center bg-black">
        <DefaultLoadingSuspense>
          <NeuronViewer useEvents useActions modelSelfUrl={resource._self} />
        </DefaultLoadingSuspense>
      </div>
      <div className="secondary-scrollbar h-[calc(100%-100px)] w-full overflow-y-auto p-8">
        <SynaptomeConfigurationForm
          {...{
            resource,
            org: virtualLabId,
            project: projectId,
            resourceLoading: loading,
          }}
        />
      </div>
    </div>
  );
}

export default SynaptomeConfiguration;
