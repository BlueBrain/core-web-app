import { useState } from 'react';
import { DeleteOutlined, WarningFilled } from '@ant-design/icons';
import { Button, Card, Form, InputNumber, Select } from 'antd';
import delay from 'lodash/delay';

import { SingleSynaptomeConfig, SynaptomeConfigDistribution } from '@/types/synaptome';
import { UpdateSynapseSimulationProperty } from '@/types/simulation/single-neuron';
import { classNames } from '@/util/utils';
import useNotification from '@/hooks/notifications';
import VisualizeSynaptomeButton from '@/components/build-section/virtual-lab/synaptome/ShowHideSynaptomeButton';

type Props = {
  index: number;
  formName: string;
  onChange: (change: UpdateSynapseSimulationProperty) => void;
  removeForm: (key: string) => void;
  synaptomeModelConfig: SynaptomeConfigDistribution;
  selectedSynapseGroupPlacementConfig?: SingleSynaptomeConfig;
};

export default function SynapseSimulationForm({
  index,
  formName,
  onChange,
  removeForm,
  synaptomeModelConfig,
  selectedSynapseGroupPlacementConfig,
}: Props) {
  const { error: notifyError } = useNotification();
  const [visualizationState, setVisualizationState] = useState<'idle' | 'success' | 'error'>(
    'idle'
  );

  const onVisualizationError = () => {
    notifyError(
      'There was an error when visualizing synapses for this synapse group.',
      undefined,
      'topRight'
    );
    setVisualizationState('error');
    return delay(() => setVisualizationState('idle'), 2000);
  };

  const onVisualizationSuccess = () => {
    setVisualizationState('success');
    return delay(() => setVisualizationState('idle'), 2000);
  };

  return (
    <Card
      size="small"
      className={classNames(
        'm-2 border border-gray-300',
        visualizationState === 'error' && 'border-2 border-rose-500',
        visualizationState === 'success' && 'border-2 border-teal-500'
      )}
      title={`Synapse Configuration  ${index + 1}`}
      headStyle={{ background: '#e4e4e4' }}
      key={formName}
      extra={
        <div className="flex items-center gap-1">
          <VisualizeSynaptomePerSimulationConfig
            placementConfig={selectedSynapseGroupPlacementConfig}
            modelSelf={synaptomeModelConfig.meModelSelf}
            onError={onVisualizationError}
            onSuccess={onVisualizationSuccess}
            id={formName}
          />
          <Button
            aria-label="Delete synapse configuration"
            onClick={() => removeForm(formName)}
            icon={<DeleteOutlined />}
            type="default"
            htmlType="button"
          />
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <Form.Item
          name={[formName, 'synapseId']}
          label="Synapse Set"
          rules={[{ required: true, type: 'string' }]}
          labelAlign="left"
          className="mb-0"
        >
          <Select
            showSearch
            placeholder="Select synapse set"
            onChange={(newValue) =>
              onChange({
                id: `${formName}`,
                key: 'synapseId',
                newValue,
              })
            }
            options={
              synaptomeModelConfig.synapses.map((synapse) => ({
                value: synapse.id,
                label: synapse.id,
              })) ?? []
            }
            className="text-left"
          />
        </Form.Item>
        <Form.Item
          name={[formName, 'delay']}
          label="Delay"
          rules={[{ required: true, type: 'number' }]}
          labelAlign="left"
          className="mb-0"
        >
          <InputNumber<number>
            addonAfter="ms"
            className="w-full text-right"
            type="number"
            onChange={(newVal) =>
              onChange({
                id: `${formName}`,
                key: 'delay',
                newValue: newVal ?? 0,
              })
            }
          />
        </Form.Item>

        <Form.Item
          name={[formName, 'duration']}
          label="Duration"
          rules={[{ required: true, type: 'number' }]}
          labelAlign="left"
          className="mb-0"
        >
          <InputNumber<number>
            addonAfter="ms"
            className="w-full text-right"
            onChange={(newVal) =>
              onChange({
                id: `${formName}`,
                key: 'duration',
                newValue: newVal ?? 0,
              })
            }
          />
        </Form.Item>

        <Form.Item
          name={[formName, 'frequency']}
          label="Frequency"
          rules={[{ required: true, type: 'number' }]}
          labelAlign="left"
          className="mb-0"
        >
          <InputNumber<number>
            addonAfter="Hz"
            className="w-full text-right"
            onChange={(newVal) =>
              onChange({
                id: `${formName}`,
                key: 'frequency',
                newValue: newVal ?? 0,
              })
            }
          />
        </Form.Item>

        <Form.Item
          name={[formName, 'weightScalar']}
          label="Weight Scalar"
          rules={[{ required: true, type: 'number' }]}
          labelAlign="left"
          className="mb-0"
        >
          <InputNumber<number>
            className="w-full text-right"
            onChange={(newVal) =>
              onChange({
                id: `${formName}`,
                key: 'weightScalar',
                newValue: newVal ?? 0,
              })
            }
          />
        </Form.Item>
      </div>
    </Card>
  );
}

function VisualizeSynaptomePerSimulationConfig({
  placementConfig,
  modelSelf,
  onError,
  onSuccess,
  id,
}: {
  placementConfig?: SingleSynaptomeConfig;
  modelSelf?: string;
  id: string;
  onError: () => void;
  onSuccess: () => void;
}) {
  if (!placementConfig || !modelSelf) {
    return (
      <WarningFilled
        className="text-warning"
        title="No configuration could be found for selected synapse group"
      />
    );
  }

  return (
    <VisualizeSynaptomeButton
      config={placementConfig}
      seed={placementConfig.seed!}
      modelSelf={modelSelf}
      onError={onError}
      onSuccess={onSuccess}
      disable={false}
      id={id}
    />
  );
}
