'use client';

import { useMemo, useReducer, useRef, useState } from 'react';
import { Form, Input, Select, Button, FormListFieldData, InputNumber } from 'antd';
import { useAtom, useAtomValue } from 'jotai';
import {
  CloseOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  InfoCircleFilled,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Color } from 'three';

import isEqual from 'lodash/isEqual';
import groupBy from 'lodash/groupBy';
import findIndex from 'lodash/findIndex';

import { GENERATE_SYNAPSES_FAIL, sectionTargetMapping } from './constants';
import { classNames } from '@/util/utils';
import { SingleSynaptomeConfig } from '@/types/synaptome';
import { SectionSynapses, synapsesPlacementAtom } from '@/state/synaptome';
import {
  sendDisplaySynapses3DEvent,
  sendRemoveSynapses3DEvent,
} from '@/components/neuron-viewer/hooks/events';
import { validateFormula } from '@/api/bluenaas/validateSynapseGenerationFormula';
import { createBubblesInstanced } from '@/services/bluenaas-single-cell/renderer-utils';
import { SettingAdjustment } from '@/components/icons/SettingAdjustment';
import { secNamesAtom } from '@/state/simulate/single-neuron';
import { getSynaptomePlacement } from '@/api/bluenaas';
import { getSession } from '@/authFetch';

import useNotification from '@/hooks/notifications';

type Props = {
  modelId: string;
  index: number;
  disableApplyChanges: boolean;
  field: FormListFieldData;
  removeGroup: (index: number | number[]) => void;
};

const label = (text: string) => (
  <span className={classNames('text-base font-bold capitalize text-gray-500')}>{text}</span>
);

export default function SynapseSet({
  modelId,
  index,
  field,
  removeGroup,
  disableApplyChanges,
}: Props) {
  const { error: notifyError } = useNotification();
  const form = Form.useFormInstance();
  const secNames = useAtomValue(secNamesAtom);
  const [synapseVis, setSynapseVis] = useState(false);
  const [visualizeLoading, setLoadingVisualize] = useState(false);

  const [synapsesPlacement, setSynapsesPlacementAtom] = useAtom(synapsesPlacementAtom);
  const [displayExclusionRules, toggleDisplayExclusionRules] = useReducer((val) => !val, false);
  const [displayFormulaHelp, toggleFormulaHelp] = useReducer((val) => !val, false);

  const synapses = Form.useWatch<Array<SingleSynaptomeConfig>>('synapses', form);
  const seed = Form.useWatch<number>('seed', form);

  const config = synapses?.[index];
  const configRef = useRef(config);

  const groupedSections = Object.keys(
    groupBy(secNames, (str) => {
      const bracketIndex = findIndex(str, (char) => char === '[');
      return bracketIndex !== -1 ? str.slice(0, bracketIndex) : str;
    })
  );

  const targetOptions = groupedSections.map((value) => ({
    value,
    label: sectionTargetMapping[value as keyof typeof sectionTargetMapping],
  }));

  const isAlreadyVisualized = useMemo(
    () =>
      !!Object.values(synapsesPlacement ?? []).find(
        (c) =>
          config &&
          c?.synapsePlacementConfigId === config.id &&
          c.meshId &&
          isEqual(config, configRef.current)
      ),
    [config, synapsesPlacement]
  );

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

  const addNewExclusionRule = () => {
    const id = crypto.randomUUID();
    if (config) {
      form.setFieldValue(['synapses', index], {
        ...config,
        exclusion_rules: [
          ...(config?.exclusion_rules ?? []),
          {
            id,
            distance_soma_gte: undefined,
            distance_soma_lte: undefined,
          },
        ],
      });
    }
  };

  const onTargetChange = (newTarget?: keyof typeof sectionTargetMapping) => {
    if (newTarget === 'soma') {
      form.setFieldValue(['synapses', index], {
        ...config,
        formula: undefined,
        target: newTarget,
        soma_synapse_count: 50,
      });
    }
    if (config?.target === 'soma' && newTarget !== 'soma') {
      form.setFieldValue(['synapses', index], {
        ...config,
        soma_synapse_count: undefined,
        target: newTarget,
      });
    }
  };

  const showExclusionRules = () => {
    if (config && !config.exclusion_rules?.length && !displayExclusionRules) {
      addNewExclusionRule();
    }
    toggleDisplayExclusionRules();
  };

  const exclusionRuleNotFilled =
    config?.exclusion_rules?.some((p) => !p.distance_soma_gte && !p.distance_soma_lte) &&
    !displayExclusionRules;

  const onVisualizationError = async (response?: Response) => {
    if (!response) {
      notifyError(
        GENERATE_SYNAPSES_FAIL.replace('$$', (index + 1).toString()),
        undefined,
        'topRight'
      );
      return;
    }

    try {
      const errorDetails = await response.json();
      notifyError(errorDetails.details, undefined, 'topRight');
    } catch {
      notifyError(
        GENERATE_SYNAPSES_FAIL.replace('$$', (index + 1).toString()),
        undefined,
        'topRight'
      );
    }
  };

  const onVisualizeSynapome = async () => {
    if (isAlreadyVisualized) {
      return;
    }

    setLoadingVisualize(true);
    onHideSynapse();

    try {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error('No session found');
      }
      const response = await getSynaptomePlacement({
        modelId,
        seed,
        config,
        token: session?.accessToken,
      });
      if (!response.ok) {
        return onVisualizationError(response);
      }

      const result: { synapses: Array<SectionSynapses> } = await response.json();

      const synapsePositions = result.synapses
        .flat()
        .flatMap((p) => p.synapses)
        .map((o) => o.coordinates);

      const mesh = createBubblesInstanced(synapsePositions, new Color(config.color));

      sendDisplaySynapses3DEvent(config.id, mesh);

      setSynapsesPlacementAtom({
        ...synapsesPlacement,
        [config.id]: {
          sectionSynapses: result.synapses,
          count: synapsePositions.length,
          meshId: mesh.uuid,
          synapsePlacementConfigId: config.id,
        },
      });
      setSynapseVis(true);
      configRef.current = config;
    } catch (error) {
      return onVisualizationError();
    } finally {
      setLoadingVisualize(false);
    }
  };

  return (
    <div className="w-full">
      <div
        id={`synaptic-input-${index}`}
        className="flex min-w-max items-center justify-between gap-2 text-lg font-bold"
      >
        <div className="flex items-center justify-center gap-2">
          <div
            className="bg-primary-8 px-6 py-3 font-bold text-white"
            style={{ backgroundColor: config?.color }}
          >
            {' '}
            {index + 1}
          </div>
          {synapsesPlacement?.[config?.id]?.count && (
            <span className="text-base font-light text-primary-7">
              {synapsesPlacement?.[config?.id]?.count} synapses generated
            </span>
          )}
          <button
            type="button"
            aria-label="Hide synapses"
            onClick={onHideSynapse}
            disabled={!synapseVis}
            title="Show synapses"
            className={classNames(
              'cursor-pointer items-center justify-center gap-1',
              isAlreadyVisualized ? 'flex' : 'hidden'
            )}
          >
            <EyeInvisibleOutlined
              className={classNames(
                'h-8 w-8 border border-gray-200 px-2',
                synapseVis ? 'text-primary-8' : 'text-gray-500'
              )}
            />
            <span className="font-light text-gray-400">Hide set</span>
          </button>
        </div>
        <div className="flex items-center justify-end gap-2">
          {synapses?.length > 1 && (
            <button
              type="button"
              onClick={onRemoveSynapse}
              aria-label="Delete Synapse"
              title="Delete Synapse"
            >
              <DeleteOutlined className="px-2 text-primary-8" />
            </button>
          )}
        </div>
      </div>
      <div className="mb-4 border border-gray-300 p-6">
        <Form.Item
          name={[field.name, 'name']}
          rules={[{ required: true, message: 'Please provide a name!' }]}
          validateTrigger="onBlur"
          label={label('Name')}
        >
          <Input
            placeholder="Name your set"
            size="large"
            className="border-0 border-b-[1.8px] border-primary-8 text-base font-bold text-primary-8"
          />
        </Form.Item>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name={[field.name, 'target']}
            rules={[{ required: false, message: 'Please select a target!' }]}
            validateTrigger="onBlur"
            label={label('Target')}
            className="!border-b-[1.8px] border-primary-8 [&_.ant-form-item-row]:mb-0 [&_.ant-form-item-row]:inline-block [&_.ant-form-item-row]:w-full [&_.ant-select-arrow]:text-primary-8 [&_.ant-select-selector]:!border-0"
          >
            <Select
              allowClear
              placeholder="Select a target"
              size="large"
              className="[&_.ant-select-selection-item]:font-bold [&_.ant-select-selection-item]:text-primary-8"
              disabled={!targetOptions.length}
              options={targetOptions}
              onChange={onTargetChange}
            />
          </Form.Item>
          <Form.Item
            name={[field.name, 'type']}
            rules={[{ required: true, message: 'Please select at least one type!' }]}
            label={label('Type')}
            validateTrigger="onBlur"
            className="!border-b-[1.8px] border-primary-8 [&_.ant-form-item-row]:mb-0 [&_.ant-form-item-row]:inline-block [&_.ant-form-item-row]:w-full [&_.ant-select-arrow]:text-primary-8 [&_.ant-select-selector]:!border-0"
          >
            <Select
              allowClear
              placeholder="Select"
              size="large"
              className="[&_.ant-select-selection-item]:font-bold [&_.ant-select-selection-item]:text-primary-8"
              options={[
                { value: 110, label: 'Excitatory Synapses' },
                { value: 10, label: 'Inhibitory Synapses' },
              ]}
            />
          </Form.Item>
        </div>

        <div className="flex items-start gap-4">
          {config?.target === 'soma' ? (
            <div className="w-full">
              <div className="flex w-full flex-col">
                <div className={classNames('flex w-full items-center gap-2 pb-[8px]')}>
                  {label('Synapse Count')}
                </div>
                <Form.Item
                  name={[field.name, 'soma_synapse_count']}
                  rules={[
                    {
                      required: true,
                      message: 'Please provide a valid count for synapses on soma',
                    },
                  ]}
                  validateTrigger="onBlur"
                >
                  <InputNumber
                    size="large"
                    className="w-full border-0 border-b-[1.8px] border-primary-8 text-base font-bold text-primary-8"
                    min={0}
                    max={1000}
                  />
                </Form.Item>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <div className="flex w-full flex-col">
                <div
                  className={classNames(
                    'flex w-full items-center gap-2 pb-[8px]',
                    displayFormulaHelp && 'justify-between'
                  )}
                >
                  {label('Formula')}
                  {displayFormulaHelp ? (
                    <CloseOutlined className="text-gray-300" onClick={toggleFormulaHelp} />
                  ) : (
                    <InfoCircleFilled className="text-gray-300" onClick={toggleFormulaHelp} />
                  )}
                </div>
                <p
                  className={classNames(
                    'font-light text-gray-400 transition-all',
                    displayFormulaHelp ? 'mb-4 h-full opacity-100' : 'mb-0 h-0 opacity-0'
                  )}
                >
                  More information on formulas here: <br />
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-8"
                    href="https://docs.sympy.org/latest/index.html"
                  >
                    https://docs.sympy.org/latest/index.html
                  </a>
                </p>
              </div>
              <input hidden readOnly name="distribution" value="formula" />
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
                      if (synapses?.[index].target === 'soma') {
                        return Promise.resolve();
                      }
                      if (value) {
                        const result = await validateFormula(value);
                        if (!result) return Promise.reject();
                        return Promise.resolve();
                      }
                      if (!value) return Promise.reject();
                    },
                  },
                ]}
                validateTrigger="onBlur"
                className={classNames(
                  '[&_.ant-form-item-required]:w-full',
                  synapses?.[index].distribution !== 'formula' ? 'hidden' : ''
                )}
              >
                <Input
                  placeholder="00.3*x*x + 0.004"
                  size="large"
                  className={classNames(
                    'text-base font-bold italic [&_.ant-input]:text-primary-8',
                    '[&_.ant-input]:border [&_.ant-input]:border-r-0 [&_.ant-input]:border-neutral-2 [&_.ant-input]:py-4',
                    '[&_.ant-input-group-addon]:border [&_.ant-input-group-addon]:border-neutral-2 [&_.ant-input-group-addon]:py-4',
                    '[&_.ant-input-group-addon]: [&_.ant-input-group-addon]:border-l-0 [&_.ant-input-group-addon]:bg-white'
                  )}
                  addonAfter={
                    <span className="w-max min-w-max not-italic text-gray-400">Synapses/µm</span>
                  }
                />
              </Form.Item>
            </div>
          )}
        </div>

        <div
          className={classNames(
            'mt-5 border border-gray-300',
            displayExclusionRules ? 'p-4 text-gray-400' : 'px-4 py-2 text-primary-8'
          )}
        >
          <button
            id="exclusion-rules-header"
            className="flex w-full items-center justify-between gap-4"
            onClick={showExclusionRules}
            type="button"
          >
            <div className="text-left text-lg font-medium">
              Filter synapses{' '}
              {Boolean(synapses?.at(field.name)?.exclusion_rules?.length) && (
                <span className="text-sm font-light text-gray-500">
                  ({synapses?.at(field.name)?.exclusion_rules?.length})
                </span>
              )}
              {exclusionRuleNotFilled && (
                <p className="text-sm font-light text-pink-700">
                  Some exclusion rules are missing.
                </p>
              )}
            </div>
            <div className="flex items-center justify-center rounded-md p-2 hover:bg-gray-200">
              {displayExclusionRules ? (
                <CloseOutlined />
              ) : (
                <SettingAdjustment className="h-5 w-5 text-primary-8" />
              )}
            </div>
          </button>
          <div
            id="exclusion-rules-body"
            className={classNames(
              'w-full transition-all',
              displayExclusionRules ? 'mt-4 flex h-full flex-col opacity-100' : 'h-0 opacity-0'
            )}
          >
            <Form.List name={[field.name, 'exclusion_rules']}>
              {(fields, { remove: removeRule }) => (
                <div className="flex w-full flex-col gap-3">
                  {fields.map((f, indx) => {
                    return (
                      <div key={f.key} className="w-full border border-gray-400 p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="text-lg font-light capitalize text-gray-400">
                            rule {indx + 1}
                          </div>
                          <Button
                            aria-label="Delete rule"
                            onClick={() => removeRule(indx)}
                            icon={<DeleteOutlined className="h-5 w-5 text-primary-8" />}
                            type="text"
                            className="h-[40px] w-[40px] rounded-md"
                          />
                        </div>
                        <div className="mb-4 text-left text-xl font-bold text-primary-8">
                          Exclude synapses that are:
                          <p className="font-light">where the distance from soma is:</p>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start justify-center gap-2">
                            <div className="font-lightw-full flex h-[40px] min-w-max max-w-max items-center justify-center text-primary-8">
                              greater or equal to
                            </div>
                            <Form.Item className="mb-2" name={[f.name, 'distance_soma_gte']}>
                              <InputNumber
                                placeholder="Enter a value..."
                                className="w-full"
                                size="large"
                                min={0}
                              />
                            </Form.Item>
                          </div>
                          <div className="flex items-start justify-center gap-2">
                            <div className="font-lightw-full flex h-[40px] min-w-max max-w-max items-center justify-center text-primary-8">
                              less or equal to
                            </div>
                            <Form.Item className="mb-2" name={[f.name, 'distance_soma_lte']}>
                              <InputNumber
                                placeholder="Enter a value..."
                                className="w-full"
                                size="large"
                                min={0}
                              />
                            </Form.Item>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Form.List>
            <button
              aria-label="Add new rule"
              onClick={addNewExclusionRule}
              type="button"
              className="mt-4 w-max border border-primary-8 bg-white px-7 py-3 text-base font-bold text-primary-8"
            >
              Add rule
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <Button
            htmlType="button"
            onClick={onVisualizeSynapome}
            disabled={disableApplyChanges}
            loading={visualizeLoading}
            size="large"
            className={classNames(
              'h-14 cursor-pointer self-end bg-primary-8 text-lg font-bold text-white',
              'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-neutral-400'
            )}
            icon={<PlusCircleOutlined />}
          >
            Apply changes
          </Button>
        </div>
      </div>
    </div>
  );
}
