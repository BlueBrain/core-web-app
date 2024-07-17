import { Select, Form, InputNumber, Card, Button } from 'antd';
import { useAtomValue, useSetAtom } from 'jotai';
import { DeleteOutlined } from '@ant-design/icons';

import AmperageRangeComponent from './AmperageRangeComponent';
import { SimAction, SingleModelSimConfig } from '@/types/simulate/single-neuron';
import { secNamesAtom } from '@/state/simulate/single-neuron';
import { stimulusTypeParams } from '@/constants/simulate/single-neuron';
import { setStimulusProtcolsAtom } from '@/state/simulate/single-neuron-setter';

type Props = {
  onChange: (action: SimAction) => void;
  simConfig: SingleModelSimConfig;
  onAddDirectStimConfig?: () => void;
  onRemoveDirectStimConfig?: (index: number) => void;
};

type FormItemProps = {
  onChange: (action: SimAction) => void;
  stimulationId: number;
};

type FormItemPropsWithConfig = {
  onChange: (action: SimAction) => void;
  stimulationId: number;
  simConfig: SingleModelSimConfig;
};

export default function Stimulation({
  onChange,
  simConfig,
  onAddDirectStimConfig,
  onRemoveDirectStimConfig,
}: Props) {
  return (
    <Form.List name="directStimulation">
      {(fields, { add, remove }) => (
        <div style={{ display: 'flex', rowGap: 2, flexDirection: 'column' }}>
          {fields.map((field) => (
            <Card
              size="small"
              className="m-2 border border-gray-300"
              title={`Configuration ${field.name + 1}`}
              headStyle={{ background: '#e4e4e4' }}
              key={field.key}
              extra={
                onRemoveDirectStimConfig && (
                  <DeleteOutlined
                    className="text-error"
                    onClick={() => {
                      remove(field.name);
                      onRemoveDirectStimConfig(field.name);
                    }}
                  />
                )
              }
            >
              <StimulusLocation onChange={onChange} stimulationId={field.name} />
              <StimulationMode onChange={onChange} stimulationId={field.name} />
              <StimulationProtocol
                onChange={onChange}
                simConfig={simConfig}
                stimulationId={field.name}
              />
              <Parameters onChange={onChange} simConfig={simConfig} stimulationId={field.name} />
              <AmperageRangeComponent
                stimulationId={field.name}
                onChange={onChange}
                amplitudes={simConfig.directStimulation[field.name].stimulus.amplitudes}
              />
            </Card>
          ))}

          {onAddDirectStimConfig && (
            <Button
              className="m-2 ml-auto w-max bg-green-600 text-white"
              type="primary"
              onClick={() => {
                add();
                onAddDirectStimConfig();
              }}
            >
              + Add Direct Current Configuration
            </Button>
          )}
        </div>
      )}
    </Form.List>
  );
}

function StimulusLocation({ onChange, stimulationId }: FormItemProps) {
  const secNames = useAtomValue(secNamesAtom);
  return (
    <Form.Item
      name={[stimulationId, 'injectTo']}
      label="Location"
      rules={[{ required: true }]}
      labelAlign="left"
      className="mb-2"
    >
      <Select
        showSearch
        placeholder="Select stimulus location"
        onChange={(newVal) =>
          onChange({
            type: 'CHANGE_DIRECT_STIM_PROPERTY',
            payload: { key: 'injectTo', value: newVal, stimulationId: `${stimulationId}` },
          })
        }
        options={secNames.map((secName) => ({ value: secName, label: secName }))}
        className="text-left"
      />
    </Form.Item>
  );
}

function StimulationMode({ onChange, stimulationId }: FormItemProps) {
  const stimulusModeClone = structuredClone(stimulusTypeParams);

  return (
    <Form.Item
      name={[stimulationId, 'stimulus', 'stimulusType']}
      label="Stimulation mode"
      rules={[{ required: true }]}
      labelAlign="left"
      className="mb-2"
    >
      <Select
        options={[...stimulusModeClone.options]}
        onSelect={(newVal) =>
          onChange({
            type: 'CHANGE_STIMULATION_TYPE',
            payload: { stimulationId: `${stimulationId}`, value: newVal },
          })
        }
        className="text-left"
      />
    </Form.Item>
  );
}

function StimulationProtocol({ onChange, simConfig, stimulationId }: FormItemPropsWithConfig) {
  const setStimulusProtcols = useSetAtom(setStimulusProtcolsAtom);

  return (
    <Form.Item
      name={[stimulationId, 'stimulus', 'stimulusProtocol']}
      label="Protocol"
      rules={[{ required: true }]}
      labelAlign="left"
      className="mb-2"
    >
      <Select
        placeholder="Select stimulus protocol"
        options={simConfig.directStimulation[stimulationId].stimulus.stimulusProtocolOptions}
        onSelect={(newVal) => {
          onChange({
            type: 'CHANGE_PROTOCOL',
            payload: { stimulationId: `${stimulationId}`, value: newVal },
          });
          setStimulusProtcols(newVal);
        }}
        className="text-left"
      />
    </Form.Item>
  );
}

function Parameters({ onChange, simConfig, stimulationId }: FormItemPropsWithConfig) {
  return (
    <div className="flex gap-6">
      {Object.entries(simConfig.directStimulation[stimulationId].stimulus.paramInfo).map(
        ([key, info]) => (
          <Form.Item
            key={key}
            name={[stimulationId, 'stimulus', 'paramValues', key]}
            label={info.name}
            rules={[{ required: true }]}
            tooltip={info.description}
            labelAlign="left"
            className="mb-2"
          >
            <InputNumber
              disabled
              addonAfter={info.unit}
              className="w-full text-right"
              step={info.step}
              min={info.min}
              max={info.max}
              onChange={(newVal) =>
                onChange({
                  type: 'CHANGE_STIM_PARAM',
                  payload: { key, value: newVal, stimulationId: `${stimulationId}` },
                })
              }
            />
          </Form.Item>
        )
      )}
    </div>
  );
}
