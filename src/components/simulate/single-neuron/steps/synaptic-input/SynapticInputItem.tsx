import { useState } from 'react';
import {
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Button, Form, Select, SelectProps } from 'antd';
import { useAtom, useAtomValue } from 'jotai';
import { Color } from 'three';

import ConfigInputList from './ConfigInput';
import useNotification from '@/hooks/notifications';

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

  const onVisualizationError = () => {
    notifyError(
      `There was an error when visualizing synaptic input ${index}.`,
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
      const response = await getSynaptomePlacement({
        modelId: synaptomeModelConfig.meModelSelf,
        seed: selectedSynapticInputPlacementConfig?.seed!,
        config: selectedSynapticInputPlacementConfig!,
        token: session?.accessToken,
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
      return onVisualizationError();
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
              style={{ backgroundColor: config.color }}
            >
              {' '}
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
            <Button
              aria-label={`Delete synaptic input ${index}`}
              onClick={removeForm}
              icon={<DeleteOutlined />}
              type="text"
              htmlType="button"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6 border border-neutral-4 p-6">
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
