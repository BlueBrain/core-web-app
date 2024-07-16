'use client';

import { Form, Input, Select, Button, ConfigProvider, Space, Tag, InputNumber } from 'antd';
import { DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { classNames, createHeaders } from '@/util/utils';
import { composeUrl, removeMetadata } from '@/util/nexus';
import {
  NEXUS_SYNAPTOME_TYPE,
  SingleSynaptomeConfig,
  SynaptomeConfiguration,
} from '@/types/synaptome';
import { EntityResource } from '@/types/nexus';
import useNotification from '@/hooks/notifications';
import { getSession } from '@/authFetch';

const CREATE_SYNAPTOME_SUCCESS = 'The synapse has been successfully added to the neuron.';
const CREATE_SYNAPTOME_FAIL =
  'Failed to process your synapse addition request. Please review the form and try again or contact support.';

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
};

type Props = {
  resource: EntityResource;
  org: string;
  project: string;
};

export default function SynaptomeMConfigurationForm({ org, project, resource }: Props) {
  const [form] = Form.useForm<SynaptomeConfiguration>();
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

  const onFinish = async (values: SynaptomeConfiguration) => {
    try {
      const ready = false; // TODO: waiting for the schema to be ready to change the payload format
      if (ready) {
        const session = await getSession();
        const resourceUrl = composeUrl('resource', '', {
          org,
          project,
          sync: true,
          schema: null,
        });

        const sanitizedResource = removeMetadata({
          ...resource,
          '@type': NEXUS_SYNAPTOME_TYPE,
          name: values.name,
          description: values.description,
          configuration: {
            seed: values.seed,
            synapses: values.synapses,
          },
        });

        const resp = await fetch(resourceUrl, {
          method: 'POST',
          headers: createHeaders(session.accessToken),
          body: JSON.stringify(sanitizedResource),
        });

        if (!resp.ok) {
          return notifyError(CREATE_SYNAPTOME_FAIL, undefined, 'topRight');
        }
        notifySuccess(CREATE_SYNAPTOME_SUCCESS, undefined, 'topRight');
      }
    } catch (error) {
      notifyError(CREATE_SYNAPTOME_FAIL, undefined, 'topRight');
    }
  };

  return (
    <ConfigProvider theme={{ hashed: false, token: { borderRadius: 0 } }}>
      <Form
        form={form}
        name="neuron-form"
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          name: '',
          description: '',
          seed: 100,
          synapses: [
            {
              id: crypto.randomUUID(),
              name: '',
              target: undefined,
              type: undefined,
              distribution: undefined,
              formula: '',
            },
          ],
        }}
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
          {(fields, op) => {
            return fields.map((field, index) => {
              return (
                <div key={field.key} className="mb-4 rounded-md border border-zinc-300 p-6">
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
                          { value: 'excitatory', label: 'Excitatory Synapses' },
                          { value: 'inhibitory', label: 'Inhibitory Synapses' },
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
                      rules={[{ required: true, message: 'Please provide a valid formula!' }]}
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
                      <Button type="default" htmlType="button" icon={<EyeOutlined />}>
                        Visualize Synaptome
                      </Button>
                      {synapses?.length > 1 && (
                        <Button
                          type="default"
                          htmlType="button"
                          aria-label="Delete Synapse"
                          onClick={() => op.remove(index)}
                          icon={<DeleteOutlined />}
                        />
                      )}
                    </Space>
                  </Form.Item>
                </div>
              );
            });
          }}
        </Form.List>

        <Form.Item className="my-6">
          <Space className="w-full justify-end">
            <Button type="default" htmlType="reset">
              Reset
            </Button>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </ConfigProvider>
  );
}
