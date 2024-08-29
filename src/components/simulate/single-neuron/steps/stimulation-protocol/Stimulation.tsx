import { Select, Form, Card, Button } from 'antd';
import { useAtomValue } from 'jotai';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

import AmperageRange from './AmperageRange';
import { secNamesAtom } from '@/state/simulate/single-neuron';
import {
  DEFAULT_STIM_CONFIG,
  stimulusModuleParams,
  stimulusTypeParams,
} from '@/constants/simulate/single-neuron';
import { useCurrentInjectionSimulationConfig } from '@/state/simulate/categories';
import { currentInjectionSimulationConfigAtom } from '@/state/simulate/categories/current-injection-simulation';
import { StimulusModule } from '@/types/simulation/single-neuron';

type Props = {
  modelSelfUrl: string;
};

type FormItemProps = {
  stimulationId: number;
};

export default function Stimulation({ modelSelfUrl }: Props) {
  const { add: addNewDirectConfig, remove: removeDirectConfig } =
    useCurrentInjectionSimulationConfig();
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
              <Parameters
                protocol={
                  state[field.name].stimulus.stimulusProtocol ??
                  DEFAULT_STIM_CONFIG.stimulusProtocol!
                }
              />
              <AmperageRange
                stimulationId={field.name}
                amplitudes={state[field.name].stimulus.amplitudes}
                modelSelfUrl={modelSelfUrl}
                protocol={
                  state[field.name].stimulus.stimulusProtocol ??
                  DEFAULT_STIM_CONFIG.stimulusProtocol!
                }
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
            icon={<PlusOutlined />}
          >
            Add Current Configuration
          </Button>
        </div>
      )}
    </Form.List>
  );
}

function StimulusLocation({ stimulationId }: FormItemProps) {
  const { setProperty } = useCurrentInjectionSimulationConfig();
  const secNames = useAtomValue(secNamesAtom);
  const state = useAtomValue(currentInjectionSimulationConfigAtom);
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
        value={state[stimulationId].injectTo}
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

function Parameters({ protocol }: { protocol: StimulusModule }) {
  const protocolDescription = stimulusModuleParams.options.find((p) => p.value === protocol);

  if (!protocolDescription) {
    return null;
  }

  return (
    <div className="m-4 bg-[#FAFAFA] p-4">
      <h3>Description</h3>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <span>STOP TIME</span>
          <span>{protocolDescription.stopTime} [ms]</span>
        </div>

        <div className="flex flex-col">
          <span>DELAY</span>
          <span>{protocolDescription.delay} [ms]</span>
        </div>

        <div className="flex flex-col">
          <span>STOP TIME</span>
          <span>{protocolDescription.duration} [ms]</span>
        </div>
      </div>
    </div>
  );
}
