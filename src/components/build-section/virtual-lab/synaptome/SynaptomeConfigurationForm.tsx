'use client';

import { useState } from 'react';
import { Form, Input, Select, Button, ConfigProvider, Space, Tag, InputNumber, FormListFieldData } from 'antd';
import { useSetAtom } from 'jotai';
import { DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';

import { classNames, createHeaders } from '@/util/utils';
import { composeUrl, createDistribution, removeMetadata } from '@/util/nexus';
import { blueNaasUrl } from '@/config';
import {
  NEXUS_SYNAPTOME_TYPE,
  SingleSynaptomeConfig,
  SYNAPTOME_OBJECT_OF_STUDY,
  SynaptomeConfiguration,
} from '@/types/synaptome';
import { EntityResource } from '@/types/nexus';
import useNotification from '@/hooks/notifications';
import { getSession } from '@/authFetch';
import { SectionSynapses, synapsesPlacementAtom } from '@/state/synaptome';

const CONFIG_FILE_NAME = 'synaptome_config.json';
const CONFIG_FILE_FORMAT = 'application/json';
const CREATE_SYNAPTOME_SUCCESS = 'The synapse has been successfully added to the neuron.';
const CREATE_SYNAPTOME_FAIL =
  'Failed to process your synapse addition request. Please review the form and try again or contact support.';
const CREATE_SYNAPTOME_CONFIG_FAIL =
  'Failed to create the synaptome configuration file. Please review the form and try again or contact support.';

const GENERATE_SYNAPSES_FAIL =
  'Failed to generate synapses configuration ($$). Please review the form and try again or contact support.';

const label = (text: string) => (
  <span className="text-base font-semibold text-primary-8">{text}</span>
);

const defaultSynapseValue: SingleSynaptomeConfig = {
  id: '',
  name: 'dada',
  target: "basal",
  type: 10,
  distribution: "formula",
  formula: "x+1",
};

type Props = {
  resource: EntityResource;
  org: string;
  project: string;
  resourceLoading: boolean;
};

export default function SynaptomeMConfigurationForm({
  org,
  project,
  resource,
  resourceLoading,
}: Props) {
  const [form] = Form.useForm<SynaptomeConfiguration>();
  const [loading, setLoading] = useState(false);
  const { error: notifyError, success: notifySuccess } = useNotification();

  const synapses = Form.useWatch<Array<SingleSynaptomeConfig>>('synapses', form);

  const addNewSynapse = () => {
    form.setFieldValue('synapses', [
      ...synapses,
      {
        ...defaultSynapseValue,
        id: crypto.randomUUID(),
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
      const configFileUrl = composeUrl('file', '', { org, project });
      const SYNAPTOME_CONFIG = { synapses: values.synapses };

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
        return notifyError(CREATE_SYNAPTOME_CONFIG_FAIL, undefined, 'topRight');
      }

      const fileMetadata = await configResponse.json();
      const resourceUrl = composeUrl('resource', '', {
        org,
        project,
        sync: true,
        schema: null,
      });

      const sanitizedResource = removeMetadata({
        ...resource,
        '@type': NEXUS_SYNAPTOME_TYPE,
        objectOfStudy: SYNAPTOME_OBJECT_OF_STUDY,
        name: values.name,
        description: values.description,
        seed: values.seed,
        distribution: [createDistribution(fileMetadata)],
      });

      const resp = await fetch(resourceUrl, {
        method: 'POST',
        headers: createHeaders(session.accessToken),
        body: JSON.stringify(sanitizedResource),
      });

      if (!resp.ok) {
        return notifyError(CREATE_SYNAPTOME_FAIL, undefined, 'topRight');
      }
      form.resetFields();
      notifySuccess(CREATE_SYNAPTOME_SUCCESS, undefined, 'topRight');
    } catch (error) {
      notifyError(CREATE_SYNAPTOME_FAIL, undefined, 'topRight');
    } finally {
      setLoading(false);
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
          <InputNumber placeholder="Enter a seed " className="w-full" size="large" />
        </Form.Item>
        <div className="mb-5 flex items-center justify-between gap-2">
          <h2 className="my-3 text-xl font-bold text-primary-8">
            Synapse groups{' '}
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
            Add new Synapse
          </Button>
        </div>
        <Form.List name="synapses">
          {(fields, { remove: removeGroup }) => {
            return fields.map((field, index) => {
              return (
                <SynapseGroup key={field.key}
                  {...{
                    field,
                    index,
                    removeGroup,
                    modelId: resource._self
                  }}
                />
              );
            });
          }}
        </Form.List>

        <Form.Item className="my-6">
          <Space className="w-full justify-end">
            <Button type="default" htmlType="reset">
              Reset
            </Button>
            <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
              Save Changes
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </ConfigProvider>
  );
}

type SynapseGroupProps = {
  modelId: string;
  index: number,
  field: FormListFieldData;
  removeGroup: (index: number | number[]) => void
}

function SynapseGroup({ modelId, index, field, removeGroup }: SynapseGroupProps) {
  const [visualizeLoading, setLoadingVisualize] = useState(false);
  const [generateError, setGenerateError] = useState(false);
  const form = Form.useFormInstance();
  const seed = Form.useWatch<number>('seed', form);
  const synapses = Form.useWatch<Array<SingleSynaptomeConfig>>('synapses', form);
  const config = synapses[index];
  const setSynapsesPlacementAtom = useSetAtom(synapsesPlacementAtom({ group_id: config.id }));
  const { error: notifyError } = useNotification();


  const onVisualize = async () => {
    setLoadingVisualize(true);
    setGenerateError(false);
    try {
      const session = await getSession();
      const response = await fetch(`${blueNaasUrl}/morphology/synapses?model_id=${encodeURIComponent(modelId)}`, {
        method: 'post',
        headers: createHeaders(session.accessToken),
        body: JSON.stringify({
          seed,
          config
        })
      });
      if (!response.ok) {
        notifyError(GENERATE_SYNAPSES_FAIL.replace('$$', (index + 1).toString()), undefined, "topLeft");
        setGenerateError(true);
      }

      const result: SectionSynapses = await response.json();
      setSynapsesPlacementAtom({
        group_id: config.id,
        section_id: result.section_id,
        synapses: result.synapses,
      });
    } catch (error) {
      notifyError(GENERATE_SYNAPSES_FAIL.replace('$$', (index + 1).toString()), undefined, "topLeft");
      setGenerateError(true);
    } finally {
      setLoadingVisualize(false);
    }
  }

  return (
    <div key={field.key} className={
      classNames(
        "mb-4 rounded-md border border-zinc-300 p-6",
        generateError && "border-rose-500"
      )
    }>
      <h3 className="mb-3 text-lg font-bold text-primary-7">
        Synapse <Tag color="geekblue"> {index + 1}</Tag>
      </h3>
      <Form.Item
        name={[field.name, 'name']}
        rules={[{ required: true, message: 'Please provide a name!' }]}
        validateTrigger="onBlur"
      >
        <Input placeholder="Enter a name" size="large" className="text-base" />
      </Form.Item>
      <div className="grid grid-cols-2 gap-2">
        <Form.Item
          name={[field.name, 'target']}
          rules={[{ required: true, message: 'Please select a target!' }]}
          validateTrigger="onBlur"
          className="[&_.ant-form-item-row]:mb-0 [&_.ant-form-item-row]:inline-block [&_.ant-form-item-row]:w-full"
        >
          <Select
            allowClear
            placeholder="Select a target"
            size="large"
            options={[
              { value: 'apical', label: 'Apical' },
              { value: 'basal', label: 'Basal' },
              { value: 'soma', label: 'Soma' },
            ]}
          />
        </Form.Item>
        <Form.Item
          name={[field.name, 'type']}
          rules={[{ required: true, message: 'Please select at least one type!' }]}
          validateTrigger="onBlur"
          className="[&_.ant-form-item-row]:mb-0 [&_.ant-form-item-row]:inline-block [&_.ant-form-item-row]:w-full"
        >
          <Select
            allowClear
            placeholder="Select a type"
            size="large"
            options={[
              { value: 110, label: 'Excitatory Synapses' },
              { value: 10, label: 'Inhibitory Synapses' },
            ]}
          />
        </Form.Item>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Form.Item
          name={[field.name, 'distribution']}
          rules={[{ required: true, message: 'Please select a distribution!' }]}
          validateTrigger="onBlur"
          className="[&_.ant-form-item-row]:mb-0 [&_.ant-form-item-row]:inline-block [&_.ant-form-item-row]:w-full"
        >
          <Select
            allowClear
            placeholder="Select a distribution type"
            size="large"
            options={[
              { value: 'linear', label: 'Linear' },
              { value: 'exponential', label: 'Exponential' },
              { value: 'formula', label: 'Formula' },
            ]}
          />
        </Form.Item>
        <Form.Item
          name={[field.name, 'formula']}
          rules={[
            {
              required: true,
              message: 'Please provide a valid formula!',
              async validator(_, value) {
                if (synapses?.[index].distribution !== 'formula') {
                  return Promise.resolve();
                }
                if (!value) return Promise.reject();
              },
            },
          ]}
          validateTrigger="onBlur"
          className={classNames(
            '[&_.ant-form-item-row]:mb-0 [&_.ant-form-item-row]:inline-block [&_.ant-form-item-row]:w-full',
            synapses?.[index].distribution !== 'formula' && 'hidden'
          )}
        >
          <Input
            placeholder="Enter a valid formula"
            size="large"
            className="text-base"
          />
        </Form.Item>
      </div>
      <Form.Item className="mb-0">
        <Space className="w-full justify-end">
          <Button
            type="default"
            htmlType="button"
            icon={<EyeOutlined />}
            onClick={onVisualize}
            disabled={visualizeLoading}
            loading={visualizeLoading}
          >
            Visualize Synaptome
          </Button>
          {synapses?.length > 1 && (
            <Button
              type="default"
              htmlType="button"
              aria-label="Delete Synapse"
              onClick={() => {
                removeGroup(index);
                synapsesPlacementAtom.remove({ group_id: config.id });
              }}
              icon={<DeleteOutlined />}
            />
          )}
        </Space>
      </Form.Item>
    </div>
  )
}

