'use client';

import { useState } from 'react';
import { Form, Input, Button, ConfigProvider, Space, InputNumber } from 'antd';
import { useAtom } from 'jotai';
import { PlusOutlined } from '@ant-design/icons';

import SynapseGroup from './SynapseGroup';
import {
  CREATE_SYNAPTOME_CONFIG_FAIL,
  CREATE_SYNAPTOME_FAIL,
  CREATE_SYNAPTOME_SUCCESS,
} from './messages';
import { createHeaders, getRandomIntInclusive } from '@/util/utils';
import { composeUrl, createDistribution } from '@/util/nexus';
import {
  NEXUS_SYNAPTOME_TYPE,
  SingleSynaptomeConfig,
  SYNAPTOME_OBJECT_OF_STUDY,
  SynaptomeConfiguration,
} from '@/types/synaptome';
import { getSession } from '@/authFetch';
import { synapsesPlacementAtom } from '@/state/synaptome';
import { MEModelResource } from '@/types/me-model';
import {
  sendRemoveSynapses3DEvent,
  sendResetSynapses3DEvent,
} from '@/components/neuron-viewer/events';
import useNotification from '@/hooks/notifications';

const CONFIG_FILE_NAME = 'synaptome_config.json';
const CONFIG_FILE_FORMAT = 'application/json';

const label = (text: string) => (
  <span className="text-base font-semibold text-primary-8">{text}</span>
);

const defaultSynapseValue: SingleSynaptomeConfig = {
  id: '',
  name: '',
  target: undefined,
  type: undefined,
  distribution: undefined,
  formula: undefined,
  seed: undefined,
  exclusion_rules: null,
};

type Props = {
  resource: MEModelResource;
  org: string;
  project: string;
  resourceLoading: boolean;
};

export default function SynaptomeConfigurationForm({
  org,
  project,
  resource,
  resourceLoading,
}: Props) {
  const [loading, setLoading] = useState(false);
  const { error: notifyError, success: notifySuccess } = useNotification();

  const [form] = Form.useForm<SynaptomeConfiguration>();
  const synapses = Form.useWatch<Array<SingleSynaptomeConfig>>('synapses', form);
  const seed = Form.useWatch<number>('seed', form);
  const [synapsesPlacement, setSynapsesPlacementAtom] = useAtom(synapsesPlacementAtom);

  const addNewSynapse = () => {
    const id = crypto.randomUUID();
    setSynapsesPlacementAtom({
      ...synapsesPlacement,
      [id]: null,
    });

    form.setFieldValue('synapses', [
      ...synapses,
      {
        ...defaultSynapseValue,
        id,
        seed: seed + getRandomIntInclusive(0, seed),
      },
    ]);
  };

  const onConfigurationSubmission = async () => {
    try {
      await form.validateFields({ recursive: true });
    } catch (error) {
      return false;
    }
    const values = form.getFieldsValue();
    try {
      setLoading(true);
      const session = await getSession();
      if (!session) return;

      const configFileUrl = composeUrl('file', '', { org, project });
      const SYNAPTOME_CONFIG = { synapses: values.synapses, meModelSelf: resource._self };

      const formData = new FormData();
      const dataBlob = new Blob([JSON.stringify(SYNAPTOME_CONFIG)], { type: CONFIG_FILE_FORMAT });

      formData.append('file', dataBlob, CONFIG_FILE_NAME);

      const configResponse = await fetch(configFileUrl, {
        method: 'POST',
        headers: createHeaders(session.accessToken, {
          'x-nxs-file-content-length': dataBlob.size.toString(),
        }),
        body: formData,
      });

      if (!configResponse.ok) {
        return notifyError(
          CREATE_SYNAPTOME_CONFIG_FAIL,
          undefined,
          'topRight',
          undefined,
          'synaptome-config'
        );
      }

      const fileMetadata = await configResponse.json();
      const resourceUrl = composeUrl('resource', '', {
        org,
        project,
        sync: true,
        schema: null,
      });

      const sanitizedResource = {
        '@context': 'https://bbp.neuroshapes.org',
        '@type': NEXUS_SYNAPTOME_TYPE,
        objectOfStudy: SYNAPTOME_OBJECT_OF_STUDY,
        name: values.name,
        description: values.description,
        seed: values.seed,
        distribution: [createDistribution(fileMetadata, fileMetadata._self)],
        used: {
          '@id': resource['@id'],
          '@type': resource['@type'],
        },
        brainLocation: resource.brainLocation,
      };

      const resp = await fetch(resourceUrl, {
        method: 'POST',
        headers: createHeaders(session.accessToken),
        body: JSON.stringify(sanitizedResource),
      });

      if (!resp.ok) {
        return notifyError(
          CREATE_SYNAPTOME_FAIL,
          undefined,
          'topRight',
          undefined,
          'synaptome-config'
        );
      }
      form.resetFields();
      notifySuccess(CREATE_SYNAPTOME_SUCCESS, undefined, 'topRight');
    } catch (error) {
      notifyError(CREATE_SYNAPTOME_FAIL, undefined, 'topRight', undefined, 'synaptome-config');
    } finally {
      setLoading(false);
      sendResetSynapses3DEvent();
    }
  };

  const onSeedChange = (value: number | null) => {
    if (value) {
      const formSynapses = form.getFieldValue('synapses');
      form.setFieldsValue({
        ...form.getFieldsValue(),
        seed: value,
        synapses: formSynapses.map((c: SingleSynaptomeConfig) => ({
          ...c,
          seed: value + getRandomIntInclusive(0, value),
        })),
      });
      formSynapses.forEach((c: SingleSynaptomeConfig) => {
        const mesh = synapsesPlacement?.[c.id]?.meshId;
        if (mesh) {
          sendRemoveSynapses3DEvent(c.id, mesh);
        }
      });
    }
  };

  return (
    <ConfigProvider theme={{ hashed: false, token: { borderRadius: 0 } }}>
      <Form
        form={form}
        name="neuron-form"
        onFinish={onConfigurationSubmission}
        layout="vertical"
        initialValues={{
          name: '',
          description: '',
          seed: 100,
          synapses: [
            {
              ...defaultSynapseValue,
              id: crypto.randomUUID(),
              seed: 100,
            },
          ],
        }}
        disabled={resourceLoading}
      >
        <h1 className="mb-6 text-3xl font-bold text-primary-8">
          Single Neuron Synaptome Model Configuration
        </h1>
        <Form.Item
          name="name"
          label={label('Model name')}
          rules={[{ required: true, message: 'Please provide a name!' }]}
          validateTrigger="onBlur"
        >
          <Input placeholder="Enter a name" size="large" />
        </Form.Item>
        <Form.Item name="description" label={label('Model description')}>
          <Input.TextArea
            rows={2}
            placeholder="Description of the new Synaptome model ..."
            size="large"
          />
        </Form.Item>
        <Form.Item name="seed" label={label('Seed')}>
          <InputNumber
            placeholder="Enter a seed "
            className="w-full"
            size="large"
            onChange={onSeedChange}
          />
        </Form.Item>
        <div className="mb-5 flex items-center justify-between gap-2">
          <h2 className="my-3 text-xl font-bold text-primary-8">
            Synaptic input{' '}
            <span className="text-base font-light">
              {synapses?.length ? `(${synapses.length})` : ''}
            </span>
          </h2>
          <Button
            type="default"
            htmlType="button"
            aria-label="Add Synapse"
            onClick={addNewSynapse}
            icon={<PlusOutlined className="text-base" />}
          >
            Add new synapses
          </Button>
        </div>
        <Form.List name="synapses">
          {(fields, { remove: removeGroup }) => {
            return fields.map((field, index) => {
              return (
                <SynapseGroup
                  key={field.key}
                  {...{
                    field,
                    index,
                    removeGroup,
                    modelId: resource._self,
                  }}
                />
              );
            });
          }}
        </Form.List>

        <Form.Item className="my-6">
          <Space className="w-full justify-end">
            <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
              Save
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </ConfigProvider>
  );
}
