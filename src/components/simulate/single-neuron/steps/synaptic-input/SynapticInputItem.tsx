import { useEffect, useMemo, useRef, useState } from 'react';
import {
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  LoadingOutlined,
  WarningFilled,
} from '@ant-design/icons';
import { Button, Form, InputNumber, Select, SelectProps } from 'antd';
import { useAtom, useAtomValue } from 'jotai';
import { Color } from 'three';

import ConfigInputList from './ConfigInput';
import useNotification from '@/hooks/notifications';
import CustomPopover from '@/components/simulate/single-neuron/molecules/Popover';

import { SingleSynaptomeConfig, SynaptomeConfigDistribution } from '@/types/synaptome';
import { UpdateSynapseSimulationProperty } from '@/types/simulation/single-neuron';
import {
  sectionTargetMapping,
  synapseTypeMapping,
} from '@/components/build-section/virtual-lab/synaptome/molecules/constants';
import { SectionSynapses, synapsesPlacementAtom } from '@/state/synaptome';
import {
  sendDisplaySynapses3DEvent,
  sendRemoveSynapses3DEvent,
} from '@/components/neuron-viewer/hooks/events';
import { getSession } from '@/authFetch';
import { getSynaptomePlacement } from '@/api/bluenaas';
import { createBubblesInstanced } from '@/services/bluenaas-single-cell/renderer-utils';
import { classNames } from '@/util/utils';
import { synaptomeSimulationConfigAtom } from '@/state/simulate/categories/synaptome-simulation-config';
import { calculateRangeOutput } from '@/constants/simulate/single-neuron';
import { Switch } from '@/components/common/Switch';

type Props = {
  index: number;
  formName: string;
  onChange: (change: UpdateSynapseSimulationProperty) => void;
  removeForm: () => void;
  synaptomeModelConfig: SynaptomeConfigDistribution;
  selectedSynapticInputPlacementConfig: SingleSynaptomeConfig;
};

export default function SynapticInputItem({
  index,
  formName,
  onChange,
  removeForm,
  synaptomeModelConfig,
  selectedSynapticInputPlacementConfig,
}: Props) {
  const { error: notifyError } = useNotification();
  const [synapticInputOpened, setSynapticInputOpened] = useState(false);
  const [synapseDisplayed, setSynapseDisplayed] = useState(false);
  const [visualizeLoading, setLoadingVisualize] = useState(false);
  const [synapsesPlacement, setSynapsesPlacementAtom] = useAtom(synapsesPlacementAtom);
  const synapseSimulationAtomState = useAtomValue(synaptomeSimulationConfigAtom);
  const config = synapseSimulationAtomState[index];
  const synapseWithFrequencyStep = synapseSimulationAtomState.findIndex((s) =>
    Array.isArray(s.frequency)
  );
  const abortController = useRef(new AbortController());

  const onVisualizationError = () => {
    notifyError(
      `There was an error when visualizing synaptic input ${index + 1}.`,
      undefined,
      'topRight'
    );
  };

  const options = synaptomeModelConfig.synapses.map((op) => ({
    label: op.name,
    value: op.id,
    target: sectionTargetMapping[op.target as keyof typeof sectionTargetMapping],
    type: synapseTypeMapping[op.type as keyof typeof synapseTypeMapping],
    distribution: op.distribution !== 'formula' ? op.distribution : op.formula,
    isFormula: op.distribution === 'formula',
  }));

  const onHideSynapse = () => {
    setSynapseDisplayed(false);
    // abortController.abort();
    const currentSynapsesPlacementConfig = synapsesPlacement?.[`${index}`];
    if (currentSynapsesPlacementConfig && currentSynapsesPlacementConfig.meshId) {
      sendRemoveSynapses3DEvent(`${index}`, currentSynapsesPlacementConfig.meshId);
      setSynapsesPlacementAtom({
        ...synapsesPlacement,
        [`${index}`]: {
          ...currentSynapsesPlacementConfig,
          count: undefined,
          meshId: undefined,
        },
      });
    }
  };

  const onVisualize = async () => {
    setLoadingVisualize(true);
    onHideSynapse();
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error('No session found');
      }

      abortController.current = new AbortController();
      const response = await getSynaptomePlacement({
        modelId: synaptomeModelConfig.meModelSelf,
        seed: selectedSynapticInputPlacementConfig?.seed!,
        config: selectedSynapticInputPlacementConfig!,
        token: session?.accessToken,
        signal: abortController.current.signal,
      });
      if (!response.ok) {
        return onVisualizationError();
      }

      const result: { synapses: Array<SectionSynapses> } = await response.json();

      const synapsePositions = result.synapses
        .flat()
        .flatMap((p) => p.synapses)
        .map((o) => o.coordinates);

      const mesh = createBubblesInstanced(synapsePositions, new Color(config.color));

      sendDisplaySynapses3DEvent(`${index}`, mesh);

      setSynapsesPlacementAtom({
        ...synapsesPlacement,
        [`${index}`]: {
          sectionSynapses: result.synapses,
          count: synapsePositions.length,
          meshId: mesh.uuid,
          synapsePlacementConfigId: selectedSynapticInputPlacementConfig?.id!,
        },
      });
      setSynapseDisplayed(true);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        return onVisualizationError();
      }
    } finally {
      setLoadingVisualize(false);
    }
  };

  const onIdChange = (newValue: string) => {
    onHideSynapse();
    onChange({
      id: index,
      key: 'id',
      newValue,
    });
  };

  useEffect(() => {
    return () => {
      abortController.current.abort();
    };
  }, []);

  return (
    <div className="flex w-full flex-col items-start justify-start">
      <div
        id={`synaptic-input-${index}`}
        className="flex w-full min-w-max items-center justify-between gap-2 text-lg font-bold"
      >
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <div
              className="px-6 py-3 font-bold text-white"
              style={{ backgroundColor: config?.color }}
            >
              {index + 1}
            </div>
            <span className="font-light text-primary-8">Synaptic input</span>
          </div>
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Hide synapses"
              onClick={synapseDisplayed ? onHideSynapse : onVisualize}
              disabled={visualizeLoading}
              title="Show synapses"
              className="flex cursor-pointer items-center justify-center gap-1"
            >
              <span className="text-sm font-light text-gray-400">
                {synapseDisplayed ? 'Hide input' : 'Show input'}
              </span>
              <div className="border border-gray-200">
                {/* eslint-disable-next-line no-nested-ternary */}
                {synapseDisplayed ? (
                  <EyeInvisibleOutlined className="h-8 w-8 px-2 text-primary-8" />
                ) : visualizeLoading ? (
                  <LoadingOutlined className="h-8 w-8  px-2 text-primary-8" />
                ) : (
                  <EyeOutlined className="h-8 w-8 px-2 text-primary-8" />
                )}
              </div>
            </button>
            <CustomPopover
              message="Are you sure you want to delete this synaptic input configuration?"
              onConfirm={() => {
                removeForm();
                abortController.current.abort();
              }}
            >
              <Button
                aria-label={`Delete synaptic input ${index}`}
                icon={<DeleteOutlined />}
                type="text"
                htmlType="button"
              />
            </CustomPopover>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-6 border border-neutral-4 p-6">
        <div className="flex flex-col">
          <div className="mb-2 text-left text-lg uppercase text-neutral-4">synapse group</div>
          <Form.Item
            name={[formName, 'id']}
            rules={[{ required: true, type: 'string' }]}
            labelAlign="left"
            className={classNames('mb-0', synapticInputOpened && 'border border-neutral-4')}
          >
            <Select
              showSearch
              placeholder="Select synapse set"
              onChange={onIdChange}
              size="large"
              placement="bottomLeft"
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
              optionRender={OptionRender}
              options={options}
              className={classNames(
                'text-left [&_.ant-select-dropdown]:relative [&_.ant-select-dropdown]:shadow-none [&_.ant-select-dropdown]:!outline-0',
                '[&_.ant-select-dropdown]:!bottom-auto [&_.ant-select-dropdown]:!left-0 [&_.ant-select-dropdown]:!right-auto [&_.ant-select-dropdown]:!top-[4px]',
                '[&_.ant-select-item]:border-b [&_.ant-select-item]:border-neutral-4 [&_.ant-select-item]:p-1 [&_.ant-select-item]:last:border-none',
                synapticInputOpened &&
                  '[&_.ant-select-selector]:!border-none [&_.ant-select-selector]:!shadow-none'
              )}
              onDropdownVisibleChange={setSynapticInputOpened}
            />
          </Form.Item>
        </div>
        <ConfigInputList index={index} formName={formName} onChange={onChange} />
        <FrequencyFormItem
          index={index}
          formName={formName}
          onChange={onChange}
          simIndexWithVariableFrequency={synapseWithFrequencyStep}
        />
      </div>
    </div>
  );
}

const defaultStepFrequencies = { start: 5, stop: 20, step: 3 };

function FrequencyFormItem({
  index,
  formName,
  onChange,
  simIndexWithVariableFrequency,
}: {
  index: number;
  formName: string;
  simIndexWithVariableFrequency: number;
  onChange: (change: UpdateSynapseSimulationProperty) => void;
}) {
  const [constantOrSteps, setConstantOrStep] = useState<'constant' | 'step'>('constant');
  const [stepFrequencyState, setStepFrequencyState] = useState<{
    start: number;
    stop: number;
    step: number;
  } | null>(null);

  const disableFrequencyStepper =
    simIndexWithVariableFrequency !== -1 && simIndexWithVariableFrequency !== index;

  const onSwitchChange = (hasSteps: boolean) => {
    if (hasSteps) {
      setConstantOrStep('step');
      setStepFrequencyState({ ...defaultStepFrequencies });
      onChange({
        id: index,
        key: 'frequency',
        newValue: calculateRangeOutput(
          defaultStepFrequencies.start,
          defaultStepFrequencies.stop,
          defaultStepFrequencies.step
        ),
      });
    } else {
      setConstantOrStep('constant');
      setStepFrequencyState(null);
      onChange({
        id: index,
        key: 'frequency',
        newValue: 20,
      });
    }
  };

  const onFrequencyStepChange = (start: number, stop: number, step: number) => {
    setStepFrequencyState({ start, stop, step });
    onChange({
      id: index,
      key: 'frequency',
      newValue: calculateRangeOutput(start, stop, step),
    });
  };

  const calculatedFrequencies = useMemo(() => {
    if (!stepFrequencyState) {
      return null;
    }

    const stepFrequencies = calculateRangeOutput(
      stepFrequencyState.start,
      stepFrequencyState.stop,
      stepFrequencyState.step
    );
    return stepFrequencies;
  }, [stepFrequencyState]);

  const disableStepperContent = (
    <div className="text-left">
      You can only set one stepper across all the synaptic inputs and in the simulation protocols.
      <div className="mt-8">
        <h4 className="text-primary-3">Active stepper location</h4>
        <p>Synaptic inputs [{simIndexWithVariableFrequency + 1}]</p>
      </div>
    </div>
  );
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="mb-2 text-left text-base font-light uppercase text-neutral-4">
          Frequency <span className="normal-case">[Hz]</span>
        </div>

        <div className="flex">
          {disableFrequencyStepper && (
            <CustomPopover message={disableStepperContent} when="hover">
              <div className="mr-2  text-sm text-primary-9">
                <WarningFilled className="mr-2" />
                Stepper already assigned
              </div>
            </CustomPopover>
          )}
          <span
            className={classNames(
              'mr-2 text-sm font-light text-primary-9',
              disableFrequencyStepper && '!text-gray-400'
            )}
          >
            Has steps
          </span>
          <Switch
            value={constantOrSteps === 'step'}
            onChange={(hasSteps) => onSwitchChange(hasSteps)}
            disabled={disableFrequencyStepper}
          />
        </div>
      </div>

      <div className="text-left">
        {constantOrSteps === 'constant' ? (
          <Form.Item
            name={[formName, 'frequency']}
            rules={[{ required: true, message: 'Required field' }]}
          >
            <InputNumber
              className="!rounded-sm border !border-neutral-4 font-bold [&_.ant-input-number-input]:!text-base [&_.ant-input-number-input]:!text-primary-8"
              min={0}
              onChange={(newValue) =>
                onChange({
                  id: index,
                  key: 'frequency',
                  newValue,
                })
              }
            />
          </Form.Item>
        ) : (
          <div className="mt-2 flex justify-between">
            <div className="flex items-center text-sm">
              <div>
                <span className="font-bold text-primary-8">Start</span>
                <InputNumber
                  required
                  defaultValue={stepFrequencyState!.start}
                  onChange={(v) =>
                    v !== null &&
                    stepFrequencyState &&
                    onFrequencyStepChange(v, stepFrequencyState.stop, stepFrequencyState.step)
                  }
                  placeholder="end"
                  min={0}
                  step={1}
                  size="small"
                  className="min-w-18 mx-2 h-8 [&_.ant-input-number-input]:!pr-8 [&_.ant-input-number-input]:!text-right [&_.ant-input-number-input]:!font-bold [&_.ant-input-number-input]:!text-primary-8"
                />
                <span className="text-gray-400">[Hz]</span>
              </div>
              <hr className="mx-4 w-8 border border-gray-200" />
              <div>
                <span className="font-bold text-primary-8">Stop</span>
                <InputNumber
                  required
                  placeholder="end"
                  defaultValue={stepFrequencyState!.stop}
                  onChange={(v) =>
                    v &&
                    stepFrequencyState &&
                    onFrequencyStepChange(stepFrequencyState.start, v, stepFrequencyState.step)
                  }
                  min={1}
                  step={1}
                  size="small"
                  className="min-w-18 mx-2 h-8 [&_.ant-input-number-input]:!pr-8 [&_.ant-input-number-input]:!text-right [&_.ant-input-number-input]:!font-bold [&_.ant-input-number-input]:!text-primary-8"
                />
                <span className="text-gray-400">[Hz]</span>
              </div>
            </div>

            <div className="flex items-center text-sm">
              <span className="font-bold text-primary-8">N° of steps</span>
              <InputNumber
                required
                placeholder="step size"
                step={1}
                min={1}
                defaultValue={stepFrequencyState!.step}
                onChange={(v) =>
                  v &&
                  stepFrequencyState &&
                  onFrequencyStepChange(stepFrequencyState.start, stepFrequencyState.stop, v)
                }
                size="small"
                className="mx-2 h-8 min-w-10 [&_.ant-input-number-handler-wrap]:!opacity-100 [&_.ant-input-number-input]:!pr-8 [&_.ant-input-number-input]:!text-right [&_.ant-input-number-input]:!font-bold [&_.ant-input-number-input]:!text-primary-8"
              />
            </div>
          </div>
        )}
        {calculatedFrequencies && (
          <div>
            <div className="mb-2 mt-4 text-left text-base font-light uppercase text-neutral-4">
              Output values
            </div>

            {calculatedFrequencies.map((f) => (
              <span className="mx-2 text-sm " key={f}>
                {f}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OptionRender({ data }: Parameters<NonNullable<SelectProps['optionRender']>>[0]) {
  return (
    <div className="flex flex-col gap-2 border-b border-neutral-4 last:border-none">
      <div className="flex w-full items-center gap-px">
        <div className="line-clamp-1 text-lg font-bold text-primary-8">{data.label}</div>
      </div>
      <div className="grid w-full grid-cols-3 items-start justify-start gap-3">
        <div className="flex w-full items-start gap-1">
          <span className="text-base text-neutral-4">Target:</span>
          <span className="line-clamp-1 text-base font-bold text-primary-8">{data.target}</span>
        </div>
        <div className="flex w-full items-start gap-1">
          <span className="text-base text-neutral-4">Type:</span>
          <span className="line-clamp-1 text-base font-bold text-primary-8">{data.type}</span>
        </div>
        <div className="line-clamp-1 flex w-full items-start gap-1">
          <span className="text-base text-neutral-4">Distribution:</span>
          <span className="line-clamp-1 text-base font-bold text-primary-8">
            {data.isFormula ? <code>{data.distribution}</code> : <span>{data.distribution}</span>}
          </span>
        </div>
      </div>
    </div>
  );
}
