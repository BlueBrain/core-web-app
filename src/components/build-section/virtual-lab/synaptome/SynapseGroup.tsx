'use client';

import { useState } from 'react';
import { Form, Input, Select, Button, Space, Tag, FormListFieldData } from 'antd';
import { useAtom } from 'jotai';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Vector3 } from 'three';
import delay from 'lodash/delay';

import { GENERATE_SYNAPSES_FAIL } from './messages';
import { sendDisplaySynapses3DEvent, sendRemoveSynapses3DEvent } from './events';
import { classNames } from '@/util/utils';
import { SingleSynaptomeConfig } from '@/types/synaptome';
import useNotification from '@/hooks/notifications';
import {
  SectionSynapses,
  synapsesPlacementAtom,
  SynapseTypeColorMap,
  SynapseTypeColorMapKey,
} from '@/state/synaptome';

import { createBubble } from '@/services/bluenaas-single-cell/renderer-utils';
import getSynapsesPlacement from '@/services/bluenaas-synaptome/getSynapsesPlacement';

type Props = {
  modelId: string;
  index: number;
  field: FormListFieldData;
  removeGroup: (index: number | number[]) => void;
};

export default function SynapseGroup({ modelId, index, field, removeGroup }: Props) {
  const [visualizeLoading, setLoadingVisualize] = useState(false);
  const [generateError, setGenerateError] = useState(false);
  const [generateSuccess, setGenerateSuccess] = useState(false);
  const [synapsesPlacement, setSynapsesPlacementAtom] = useAtom(synapsesPlacementAtom);
  const { error: notifyError } = useNotification();
  const form = Form.useFormInstance();
  const seed = Form.useWatch<number>('seed', form);
  const synapses = Form.useWatch<Array<SingleSynaptomeConfig>>('synapses', form);

  const removeSynapse = () => {
    removeGroup(index);
    const config = synapses?.[index];
    const currentConfig = synapsesPlacement?.[config.id];
    if (currentConfig && currentConfig.threeDObjects?.length) {
      sendRemoveSynapses3DEvent(config.id, currentConfig.threeDObjects);
    }
  };

  const onVisualize = async () => {
    setLoadingVisualize(true);
    setGenerateError(false);
    const config = synapses?.[index];
    const meshObjects = synapsesPlacement?.[config.id]?.threeDObjects;
    if (meshObjects) {
      sendRemoveSynapses3DEvent(config.id, meshObjects);
    }

    try {
      const response = await getSynapsesPlacement({ modelId, seed, config });
      if (!response.ok) {
        notifyError(
          GENERATE_SYNAPSES_FAIL.replace('$$', (index + 1).toString()),
          undefined,
          'topLeft'
        );
        setGenerateError(true);
        return delay(() => setGenerateError(false), 2000);
      }

      const result: { synapses: Array<SectionSynapses> } = await response.json();

      const threeDObjects = result.synapses
        .flat()
        .flatMap((p) => p.synapses)
        .map((o) => o.coordinates)
        .map((coord) => {
          const vector = new Vector3(coord[0], coord[1], coord[2]);
          return createBubble(
            vector,
            config.type ? SynapseTypeColorMap[config.type as SynapseTypeColorMapKey] : undefined
          );
        });

      sendDisplaySynapses3DEvent(config.id, threeDObjects);

      setSynapsesPlacementAtom({
        ...synapsesPlacement,
        [config.id]: {
          sectionSynapses: result.synapses,
          threeDObjects,
        },
      });
      setGenerateSuccess(true);
      return delay(() => setGenerateSuccess(false), 2000);
    } catch (error) {
      notifyError(
        GENERATE_SYNAPSES_FAIL.replace('$$', (index + 1).toString()),
        undefined,
        'topLeft'
      );
      setGenerateError(true);
      return delay(() => setGenerateError(false), 2000);
    } finally {
      setLoadingVisualize(false);
    }
  };

  return (
    <div
      key={field.key}
      className={classNames(
        'mb-4 rounded-md border border-zinc-300 p-6',
        generateError && 'border-2 border-rose-500',
        generateSuccess && 'border-2 border-teal-500'
      )}
    >
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
          rules={[{ required: false, message: 'Please select a target!' }]}
          validateTrigger="onBlur"
          className="[&_.ant-form-item-row]:mb-0 [&_.ant-form-item-row]:inline-block [&_.ant-form-item-row]:w-full"
        >
          <Select
            allowClear
            placeholder="Select a target"
            size="large"
            options={[
              { value: 'apic', label: 'Apical' },
              { value: 'basal', label: 'Basal' },
              { value: 'dend', label: 'Dendrite' },
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
          <Input placeholder="Enter a valid formula" size="large" className="text-base italic" />
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
              onClick={removeSynapse}
              icon={<DeleteOutlined />}
            />
          )}
        </Space>
      </Form.Item>
    </div>
  );
}
