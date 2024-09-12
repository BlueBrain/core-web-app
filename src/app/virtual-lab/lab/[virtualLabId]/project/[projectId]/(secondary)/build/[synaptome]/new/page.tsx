'use client';

import { ConfigProvider, Form, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { LoadingOutlined } from '@ant-design/icons';
import { useSetAtom } from 'jotai';

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
import { ExploreESHit, ExploreResource } from '@/types/explore-section/es';
import { DataType } from '@/constants/explore-section/list-views';
import { useSessionStorage } from '@/hooks/useSessionStorage';

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
  const { sessionValue } = useSessionStorage<{
    name: string;
    description: string;
    basePath: string;
    record: ExploreESHit<ExploreResource>;
    selectedRows: Array<ExploreESHit<ExploreResource>> | null;
  } | null>(`me-model/${virtualLabId}/${projectId}`, null);

  const [configStep, setConfigStep] = useState<SynaptomeModelConfigSteps>('basic-config');
  const setSelectedRows = useSetAtom(selectedRowsAtom({ dataType: DataType.CircuitMEModel }));
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
    if (sessionValue) {
      form.setFieldValue('name', sessionValue.name);
      form.setFieldValue('description', sessionValue.description);
      if (sessionValue.selectedRows && sessionValue.selectedRows.length) {
        setSelectedRows(sessionValue.selectedRows);
        form.setFieldValue('modelUrl', sessionValue.selectedRows.at(0)?._id);
      }
      setConfigStep('me-model-config');
    }
  }, [sessionValue, form, setSelectedRows]);

  if (queryParams.get('mode') === 'clone' && (!model || !configuration)) {
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
