import { Select, Form, InputNumber, Card, Button } from 'antd';
import { useAtomValue } from 'jotai';
import { DeleteOutlined } from '@ant-design/icons';

import AmperageRange from './AmperageRange';
import { secNamesAtom, } from '@/state/simulate/single-neuron';
import { stimulusTypeParams } from '@/constants/simulate/single-neuron';
import { useCurrentInjectionSimulationConfig } from '@/state/simulate/categories';
import { currentInjectionSimulationConfigAtom } from '@/state/simulate/categories/current-injection-simulation';


type Props = {
  modelSelfUrl: string;
};

type FormItemProps = {
  stimulationId: number;
};

type FormItemPropsWithConfig = {
  stimulationId: number;
};

export default function Stimulation({ modelSelfUrl }: Props) {
  const {
    add: addNewDirectConfig,
    remove: removeDirectConfig,
  } = useCurrentInjectionSimulationConfig();
  const state = useAtomValue(currentInjectionSimulationConfigAtom);
  return (
    <Form.List name="currentInjection">
      {(fields, { add, remove }) => (
        <div className="flex flex-col gap-2">
          {fields.map((field) => (
            <Card
              size="small"
              className="m-2 border border-gray-300"
              title={`Configuration ${field.name + 1}`}
              headStyle={{ background: '#e4e4e4' }}
              key={field.key}
              extra={
                <DeleteOutlined
                  className="text-error"
                  onClick={() => {
                    remove(field.name);
                    removeDirectConfig(field.name);
                  }}
                />
              }
            >
              <StimulusLocation stimulationId={field.name} />
              <StimulationMode stimulationId={field.name} />
              <StimulationProtocol stimulationId={field.name} />
              <Parameters stimulationId={field.name} />
              <AmperageRange
                stimulationId={field.name}
                amplitudes={state[field.name].stimulus.amplitudes}
                modelSelfUrl={modelSelfUrl}
              />
            </Card>
          ))}

          <Button
            className="m-2 ml-auto w-max bg-green-600 text-white"
            type="primary"
            onClick={() => {
              add();
              addNewDirectConfig();
            }}
          >
            + Add Direct Current Configuration
          </Button>
        </div>
      )}
    </Form.List>
  );
}

function StimulusLocation({ stimulationId }: FormItemProps) {
  const { setProperty } = useCurrentInjectionSimulationConfig();

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
        onChange={(newValue) =>
          setProperty({
            id: stimulationId,
            key: 'injectTo',
            newValue,
          })
        }
        options={secNames.map((secName) => ({ value: secName, label: secName }))}
        className="text-left"
      />
    </Form.Item>
  );
}

function StimulationMode({ stimulationId }: FormItemProps) {
  const stimulusModeClone = structuredClone(stimulusTypeParams);
  const { setMode } = useCurrentInjectionSimulationConfig();
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
        onSelect={(newValue) =>
          setMode({
            id: stimulationId,
            newValue,
          })
        }
        className="text-left"
      />
    </Form.Item>
  );
}

function StimulationProtocol({ stimulationId }: FormItemProps) {
  const { setProtocol } = useCurrentInjectionSimulationConfig();
  const currentInjectionConfig = useAtomValue(currentInjectionSimulationConfigAtom);
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
        options={currentInjectionConfig[stimulationId].stimulus.stimulusProtocolOptions}
        onSelect={(newValue) => {
          setProtocol({
            id: stimulationId,
            newValue,
          });
        }}
        className="text-left"
      />
    </Form.Item>
  );
}

function Parameters({ stimulationId }: FormItemPropsWithConfig) {
  const { setParamValue, state } = useCurrentInjectionSimulationConfig();
  return (
    <div className="flex gap-6">
      {Object.entries(state[stimulationId].stimulus.paramInfo).map(([key, info]) => (
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
            onChange={(newValue) =>
              setParamValue({
                id: stimulationId,
                key,
                newValue,
              })
            }
          />
        </Form.Item>
      ))}
    </div>
  );
}
