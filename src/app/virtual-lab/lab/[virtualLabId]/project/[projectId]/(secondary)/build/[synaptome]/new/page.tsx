'use client';

import { useEffect, useState } from 'react';
import { ConfigProvider, Form, Spin } from 'antd';
import { useSearchParams } from 'next/navigation';
import { LoadingOutlined } from '@ant-design/icons';

import { Content, Label, LinkItemKey } from '@/constants/virtual-labs/sidemenu';
import { generateLabUrl } from '@/util/virtual-lab/urls';
import { SynaptomeModelConfiguration } from '@/types/synaptome';
import { SynaptomeModelConfigSteps } from '@/components/build-section/virtual-lab/synaptome/molecules/types';
import { ConfigStepHeader } from '@/components/build-section/virtual-lab/synaptome/molecules';
import {
  CreateBaseSynaptome,
  MeModelsListing,
  SynaptomePlacementConfiguration,
} from '@/components/build-section/virtual-lab/synaptome/steps';
import { DEFAULT_SYNAPSE_VALUE } from '@/components/build-section/virtual-lab/synaptome/molecules/constants';
import { selectedRowsAtom } from '@/state/explore-section/list-view-atoms';
import { from64 } from '@/util/common';
import useSynaptomeModel from '@/components/simulate/single-neuron/hooks/useSynaptomeModel';
import SideMenu from '@/components/SideMenu';

type Props = {
  params: {
    projectId: string;
    virtualLabId: string;
  };
};

function Synaptome({ params: { virtualLabId, projectId } }: Props) {
  const [form] = Form.useForm();
  const [configStep, setConfigStep] = useState<SynaptomeModelConfigSteps>('basic-config');
  const queryParams = useSearchParams();

  const onConfigStep = (value: SynaptomeModelConfigSteps) => setConfigStep(value);

  const labUrl = generateLabUrl(virtualLabId);
  const labProjectUrl = `${labUrl}/project/${projectId}`;

  const { model, configuration } = useSynaptomeModel({
    virtualLabId,
    projectId,
    modelId:
      queryParams.get('mode') === 'clone' && queryParams.get('model')
        ? from64(queryParams.get('model')!)
        : null,
    callback: (m, c) => {
      // FIXME: add model row to the table selected row state to show it as selected in the second step
      form.setFieldsValue({
        name: m.name,
        description: m.description,
        modelUrl: m.used['@id'],
        seed: m.seed,
        synapses: c.synapses,
      });
    },
  });

  useEffect(() => {
    return () => {
      selectedRowsAtom.setShouldRemove(() => true);
      selectedRowsAtom.setShouldRemove(null);
    };
  }, []);

  if (queryParams.get('op') === 'clone' && !model && !configuration) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-3">
        <Spin indicator={<LoadingOutlined />} size="large" />
        <h2 className="font-light text-primary-9">Loading current configuration ...</h2>
      </div>
    );
  }

  return (
    <div className="grid h-screen max-h-screen w-full grid-cols-[min-content_auto] overflow-hidden bg-white">
      <SideMenu
        links={[
          {
            key: LinkItemKey.Build,
            href: `${labProjectUrl}/build`,
            content: Content.Build,
            styles: 'rounded-full bg-primary-5 py-3 text-primary-9 w-2/3',
          },
        ]}
        lab={{
          key: LinkItemKey.VirtualLab,
          id: virtualLabId,
          label: Label.VirtualLab,
          href: `${labUrl}/overview`,
        }}
        project={{
          key: LinkItemKey.Project,
          id: projectId,
          virtualLabId,
          label: Label.Project,
          href: `${labProjectUrl}/home`,
        }}
      />

      <ConfigProvider theme={{ hashed: false, token: { borderRadius: 0 } }}>
        <Form<SynaptomeModelConfiguration>
          form={form}
          name="synaptome-model-configuration-form"
          className="h-full"
          layout="vertical"
          initialValues={{
            name: undefined,
            description: undefined,
            modelUrl: undefined,
            seed: 100,
            synapses: [
              {
                ...DEFAULT_SYNAPSE_VALUE,
                id: crypto.randomUUID(),
                seed: 100,
              },
            ],
          }}
        >
          {configStep !== 'basic-config' && <ConfigStepHeader {...{ configStep }} />}
          <CreateBaseSynaptome {...{ configStep, onConfigStep }} />
          <MeModelsListing {...{ virtualLabId, projectId, configStep, onConfigStep }} />
          {configStep === 'placement-config' && (
            <SynaptomePlacementConfiguration {...{ virtualLabId, projectId }} />
          )}
        </Form>
      </ConfigProvider>
    </div>
  );
}

export default Synaptome;
