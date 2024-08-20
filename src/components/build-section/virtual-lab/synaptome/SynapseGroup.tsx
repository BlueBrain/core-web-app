'use client';

import { useMemo, useState } from 'react';
import { Form, Input, Select, Button, Space, Tag, FormListFieldData, InputNumber } from 'antd';
import { useAtom } from 'jotai';
import { AppstoreAddOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { z } from 'zod';
import delay from 'lodash/delay';

import { GENERATE_SYNAPSES_FAIL } from './messages';
import { sendRemoveSynapses3DEvent } from './events';
import VisualizeSynaptomeButton from './ShowHideSynaptomeButton';
import useNotification from '@/hooks/notifications';
import { classNames } from '@/util/utils';
import { SingleSynaptomeConfig } from '@/types/synaptome';
import { synapsesPlacementAtom } from '@/state/synaptome';

type Props = {
  modelId: string;
  index: number;
  field: FormListFieldData;
  removeGroup: (index: number | number[]) => void;
};

const SynapseGroupValidationSchema = z
  .object({
    name: z.string(),
    target: z.string().nullish(),
    type: z.union([z.literal(110), z.literal(10)]),
    distribution: z.union([z.literal('linear'), z.literal('exponential'), z.literal('formula')]),
    formula: z.string(),
    exclusion_rules: z
      .array(
        z.object({
          distance_soma_gte: z.number().nullish(),
          distance_soma_lte: z.number().nullish(),
        })
      )
      .nullish()
      .superRefine((values, ctx) => {
        values?.forEach((v, i) => {
          if (!v.distance_soma_gte && !v.distance_soma_lte) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Exclusion rule ${i + 1} required to have either gte, lte or both`,
              path: [`exclusion_rules[${i + 1}]`],
            });
          }
        });
      }),
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
  const [generateError, setGenerateError] = useState(false);
  const [generateSuccess, setGenerateSuccess] = useState(false);
  const [synapsesPlacement, setSynapsesPlacementAtom] = useAtom(synapsesPlacementAtom);

  const { error: notifyError } = useNotification();
  const form = Form.useFormInstance();
  const synapses = Form.useWatch<Array<SingleSynaptomeConfig>>('synapses', form);
  const seed = Form.useWatch<number>('seed', form);
  const config = synapses?.[index];
  const disableVisualizeBtn = useMemo(() => {
    const result = SynapseGroupValidationSchema.safeParse(config);
    return !result.success;
  }, [config]);

  const onHideSynapse = () => {
    const currentSynapsesPlacementConfig = synapsesPlacement?.[config.id];
    if (currentSynapsesPlacementConfig && currentSynapsesPlacementConfig.meshId) {
      sendRemoveSynapses3DEvent(config.id, currentSynapsesPlacementConfig.meshId);
      setSynapsesPlacementAtom({
        ...synapsesPlacement,
        [config.id]: {
          ...currentSynapsesPlacementConfig,
          count: undefined,
          meshId: undefined,
        },
      });
    }
  };

  const onRemoveSynapse = () => {
    removeGroup(index);
    onHideSynapse();
  };

  const onVisualizationError = () => {
    notifyError(
      GENERATE_SYNAPSES_FAIL.replace('$$', (index + 1).toString()),
      undefined,
      'topRight'
    );
    setGenerateError(true);
    return delay(() => setGenerateError(false), 2000);
  };

  const onVisualizationSuccess = () => {
    setGenerateSuccess(true);
    return delay(() => setGenerateSuccess(false), 2000);
  };

  const addNewExclusionRule = () => {
    const id = crypto.randomUUID();
    if (config) {
      form.setFieldValue(['synapses', index], {
        ...config,
        exclusion_rules: [
          ...(config?.exclusion_rules ?? []),
          {
            id,
            gte: undefined,
            lte: undefined,
          },
        ],
      });
    }
  };

  return (
    <div
      className={classNames(
        'mb-4 rounded-md border border-zinc-300 p-6',
        generateError && '!border-2 !border-rose-500',
        generateSuccess && '!border-2 !border-teal-500'
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex min-w-max items-center gap-2 text-lg font-bold text-primary-7">
          <span>Synapse set</span>
          <Tag color="geekblue"> {index + 1}</Tag>
          {synapsesPlacement?.[config?.id]?.count && (
            <span className="text-sm font-light text-gray-500">
              ({synapsesPlacement?.[config?.id]?.count} synapses generated)
            </span>
          )}
        </div>
        <Space className="w-full justify-end">
          <VisualizeSynaptomeButton
            id={config?.id}
            config={config}
            seed={seed}
            modelSelf={modelId}
            disable={disableVisualizeBtn}
            onError={onVisualizationError}
            onSuccess={onVisualizationSuccess}
          />
          {synapses?.length > 1 && (
            <Button
              aria-label="Delete Synapse"
              onClick={onRemoveSynapse}
              icon={<DeleteOutlined />}
            />
          )}
          <Button
            type="default"
            htmlType="button"
            icon={<AppstoreAddOutlined />}
            onClick={addNewExclusionRule}
          />
        </Space>
      </div>
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
      {!!config?.exclusion_rules?.length && (
        <div className="my-3 font-bold text-primary-8">Filters</div>
      )}
      <Form.List name={[field.name, 'exclusion_rules']}>
        {(fields, { remove: removeRule }) => {
          return fields.map((f, indx) => {
            return (
              <div key={f.key} className="grid grid-cols-[1fr_1fr_40px_40px] gap-x-2">
                <Form.Item className="mb-2" name={[f.name, 'distance_soma_gte']}>
                  <InputNumber addonBefore=">=" className="w-full" size="large" />
                </Form.Item>
                <Form.Item className="mb-2" name={[f.name, 'distance_soma_lte']}>
                  <InputNumber addonBefore="<=" className="w-full" size="large" />
                </Form.Item>
                <Button
                  aria-label="Delete rule"
                  onClick={() => removeRule(indx)}
                  icon={<DeleteOutlined />}
                  type="text"
                  className="h-[40px] w-[40px]"
                />
                <Button
                  aria-label="Add new rule"
                  onClick={addNewExclusionRule}
                  icon={<PlusOutlined />}
                  type="text"
                  className="h-[40px] w-[40px]"
                />
              </div>
            );
          });
        }}
      </Form.List>
    </div>
  );
}
