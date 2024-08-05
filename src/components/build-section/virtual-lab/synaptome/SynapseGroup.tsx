'use client';

import { useMemo, useState } from 'react';
import { Form, Input, Select, Button, Space, Tag, FormListFieldData } from 'antd';
import { useAtom } from 'jotai';
import { DeleteOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { z } from 'zod';
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

import { createBubblesInstanced } from '@/services/bluenaas-single-cell/renderer-utils';
import getSynapsesPlacement from '@/services/bluenaas-synaptome/getSynapsesPlacement';

type Props = {
  modelId: string;
  index: number;
  field: FormListFieldData;
  removeGroup: (index: number | number[]) => void;
};

const SynapseGroupValidationSchema = z
  .object({
    name: z.string(),
    target: z.string(),
    type: z.union([z.literal(110), z.literal(10)]),
    distribution: z.union([z.literal('linear'), z.literal('exponential'), z.literal('formula')]),
    formula: z.string(),
  })
  .superRefine((values, ctx) => {
    if (values.distribution === 'formula' && !values.formula) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Formula required when distribution is equal to formula',
        path: ['formula'],
      });
    }
  });

export default function SynapseGroup({ modelId, index, field, removeGroup }: Props) {
  const [visualizeLoading, setLoadingVisualize] = useState(false);
  const [generateError, setGenerateError] = useState(false);
  const [synapseVis, setSynapseVis] = useState(false);
  const [generateSuccess, setGenerateSuccess] = useState(false);
  const [synapsesPlacement, setSynapsesPlacementAtom] = useAtom(synapsesPlacementAtom);
  const { error: notifyError } = useNotification();
  const form = Form.useFormInstance();
  const seed = Form.useWatch<number>('seed', form);
  const synapses = Form.useWatch<Array<SingleSynaptomeConfig>>('synapses', form);

  const disableVisualizeBtn = useMemo(() => {
    const config = synapses?.[index];
    const result = SynapseGroupValidationSchema.safeParse(config);
    return !result.success;
  }, [index, synapses]);

  const onHideSynapse = () => {
    setSynapseVis(false);
    const config = synapses?.[index];
    const currentConfig = synapsesPlacement?.[config.id];
    if (currentConfig && currentConfig.meshId) {
      sendRemoveSynapses3DEvent(config.id, currentConfig.meshId);
    }
  };

  const onRemoveSynapse = () => {
    removeGroup(index);
    onHideSynapse();
  };

  const onVisualize = async () => {
    setLoadingVisualize(true);
    setGenerateError(false);
    setSynapseVis(false);
    const config = synapses?.[index];
    const meshId = synapsesPlacement?.[config.id]?.meshId;
    if (meshId) {
      sendRemoveSynapses3DEvent(config.id, meshId);
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

      const synapsePositions = result.synapses
        .flat()
        .flatMap((p) => p.synapses)
        .map((o) => o.coordinates);

      const mesh = createBubblesInstanced(
        synapsePositions,
        config.type ? SynapseTypeColorMap[config.type as SynapseTypeColorMapKey] : undefined
      );

      sendDisplaySynapses3DEvent(config.id, mesh);

      setSynapsesPlacementAtom({
        ...synapsesPlacement,
        [config.id]: {
          sectionSynapses: result.synapses,
          meshId: mesh.uuid,
        },
      });
      setGenerateSuccess(true);
      setSynapseVis(true);
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
            disabled={visualizeLoading || disableVisualizeBtn}
            loading={visualizeLoading}
          >
            Visualize Synaptome
          </Button>
          {synapseVis && (
            <Button type="default" icon={<EyeInvisibleOutlined />} onClick={onHideSynapse} />
          )}
          {synapses?.length > 1 && (
            <Button
              aria-label="Delete Synapse"
              onClick={onRemoveSynapse}
              icon={<DeleteOutlined />}
            />
          )}
        </Space>
      </Form.Item>
    </div>
  );
}
