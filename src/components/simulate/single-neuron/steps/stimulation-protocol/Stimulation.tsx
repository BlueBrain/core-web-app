import { Select, Form, Button, Collapse, ConfigProvider } from 'antd';
import { useAtomValue } from 'jotai';
import { DeleteOutlined, DownOutlined } from '@ant-design/icons';

import AmperageRange from './AmperageRange';
import { secNamesAtom } from '@/state/simulate/single-neuron';
import {
  DEFAULT_STIM_CONFIG,
  SIMULATION_COLORS,
  stimulusModuleParams,
  stimulusTypeParams,
} from '@/constants/simulate/single-neuron';
import { useCurrentInjectionSimulationConfig } from '@/state/simulate/categories';
import { currentInjectionSimulationConfigAtom } from '@/state/simulate/categories/current-injection-simulation';
import { StimulusModule } from '@/types/simulation/single-neuron';
import SelectedIcon from '@/components/icons/SelectedIcon';

type Props = {
  modelSelfUrl: string;
};

type FormItemProps = {
  stimulationId: number;
};

export default function Stimulation({ modelSelfUrl }: Props) {
  const { remove: removeDirectConfig } = useCurrentInjectionSimulationConfig();
  const state = useAtomValue(currentInjectionSimulationConfigAtom);
  return (
    <ConfigProvider
      theme={{
        components: {
          Collapse: {
            headerPadding: 0,
            contentPadding: 0,
          },
        },
      }}
    >
      <Form.List name="currentInjection">
        {(fields, { remove }) => (
          <div className="flex flex-col gap-2">
            {fields.map((field) => (
              <Collapse
                key={field.key}
                defaultActiveKey={['1']}
                accordion
                ghost
                expandIcon={() => null}
                items={[
                  {
                    key: '1',
                    label: (
                      <div className="flex w-fit items-center bg-primary-8 p-4 text-primary-4">
                        <span>Stimulation</span>{' '}
                        <span className="ml-2 font-bold text-white">1</span>
                        <DownOutlined className="ml-8 text-primary-4" size={10} />
                      </div>
                    ),
                    extra: (
                      <Button
                        onClick={() => {
                          remove(field.name);
                          removeDirectConfig(field.name);
                        }}
                        icon={<DeleteOutlined />}
                        className="border-none shadow-none"
                      />
                    ),

                    children: (
                      <div className="mt-[-12px] border border-primary-8 p-6">
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
                      </div>
                    ),
                  },
                ]}
              />
            ))}
          </div>
        )}
      </Form.List>
    </ConfigProvider>
  );
}

function StimulusLocation({ stimulationId }: FormItemProps) {
  const { setProperty } = useCurrentInjectionSimulationConfig();
  const secNames = useAtomValue(secNamesAtom);
  const state = useAtomValue(currentInjectionSimulationConfigAtom);
  return (
    <Form.Item
      name={[stimulationId, 'injectTo']}
      label={<span className="ml-2 uppercase text-gray-400">Location</span>}
      rules={[{ required: true }]}
      labelAlign="left"
      className="mb-8 w-fit border-none"
    >
      <Select
        placeholder="Select stimulus location"
        value={state[stimulationId].injectTo}
        onChange={(newValue) =>
          setProperty({
            id: stimulationId,
            key: 'injectTo',
            newValue,
          })
        }
        variant="borderless"
        className="text-left [&>.ant-select-selector>.ant-select-selection-item]:!text-base [&>.ant-select-selector>.ant-select-selection-item]:!font-bold [&>.ant-select-selector>.ant-select-selection-item]:!text-primary-8"
      >
        {secNames.map((secName) => (
          <Select.Option key={secName} value={secName} className="[&_.prefix]:!hidden">
            <div
              className="prefix mr-2 inline-block h-[10px] w-[10px] bg-primary-8"
              style={{ background: SIMULATION_COLORS[0] }}
            />{' '}
            {secName}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
}

function StimulationMode({ stimulationId }: FormItemProps) {
  const stimulusModeClone = structuredClone(stimulusTypeParams);
  const { setMode } = useCurrentInjectionSimulationConfig();
  return (
    <Form.Item
      name={[stimulationId, 'stimulus', 'stimulusType']}
      label={<span className="ml-2 uppercase text-gray-400">Stimulation Mode</span>}
      rules={[{ required: true }]}
      labelAlign="left"
      className="mb-8"
    >
      <Select
        options={[...stimulusModeClone.options]}
        onSelect={(newValue) =>
          setMode({
            id: stimulationId,
            newValue,
          })
        }
        className="text-left [&>.ant-select-selector>.ant-select-selection-item]:!text-base [&>.ant-select-selector>.ant-select-selection-item]:!font-bold [&>.ant-select-selector>.ant-select-selection-item]:!text-primary-8"
        variant="borderless"
      />
    </Form.Item>
  );
}

function StimulationProtocol({ stimulationId }: FormItemProps) {
  const { setProtocol } = useCurrentInjectionSimulationConfig();
  const currentInjectionConfig = useAtomValue(currentInjectionSimulationConfigAtom);
  return (
    <div>
      <div className="ml-2 text-left uppercase text-gray-400">Protocol</div>
      <div className="ml-2 mt-4 flex items-baseline">
        <div className="mr-16 flex items-center uppercase ">
          <SelectedIcon fill="white" className="mr-2" />{' '}
          <span className="font-bold text-primary-8">
            {currentInjectionConfig[stimulationId].stimulus.stimulusProtocol}
          </span>
        </div>
        <Form.Item
          name={[stimulationId, 'stimulus', 'stimulusProtocol']}
          label={null}
          rules={[{ required: true }]}
          labelAlign="left"
          className="mb-8"
        >
          <Select
            placeholder="Select stimulus protocol"
            onSelect={(newValue) => {
              setProtocol({
                id: stimulationId,
                newValue,
              });
            }}
            className="text-left [&>.ant-select-selector>.ant-select-selection-item]:!text-gray-400"
            variant="borderless"
            popupMatchSelectWidth={false}
            optionLabelProp="label"
          >
            {currentInjectionConfig[stimulationId].stimulus.stimulusProtocolOptions.map(
              (protocol) => (
                <Select.Option
                  key={protocol.value}
                  value={protocol.value}
                  label="Select other protocol"
                >
                  {protocol.label}
                </Select.Option>
              )
            )}
          </Select>
        </Form.Item>
      </div>
    </div>
  );
}

function Parameters({ protocol }: { protocol: StimulusModule }) {
  const protocolDescription = stimulusModuleParams.options.find((p) => p.value === protocol);

  if (!protocolDescription) {
    return null;
  }

  return (
    <div className="bg-[#FAFAFA] p-4 pt-2 text-left">
      <Collapse
        ghost
        expandIcon={() => null}
        items={[
          {
            key: '1',
            label: (
              <span className="w-fit uppercase text-gray-400">
                Description <DownOutlined className="text-xs" />{' '}
              </span>
            ),
            className: 'ml-2 p-0',
            children: <div className="text-primary-8">{protocolDescription.description}</div>,
          },
        ]}
      />

      <div className="ml-2 mt-8 flex">
        <div className="mr-8 flex cursor-not-allowed  flex-col">
          <span className="uppercase text-gray-400">Delay</span>
          <div className="text-gray-400">
            <div className="inline-block min-w-[80px] border border-gray-200 py-2 pr-2 text-right font-bold text-primary-8">
              {protocolDescription.delay}
            </div>{' '}
            [ms]
          </div>
        </div>

        <div className="mr-8 flex cursor-not-allowed flex-col">
          <span className="uppercase text-gray-400">Duration</span>
          <div className="text-gray-400">
            <div className="inline-block min-w-[80px] border border-gray-200 py-2 pr-2 text-right font-bold text-primary-8">
              {protocolDescription.duration}
            </div>{' '}
            [ms]
          </div>
        </div>

        <div className="mr-8 flex cursor-not-allowed flex-col">
          <span className="uppercase text-gray-400">Stop Time</span>
          <div className="text-gray-400">
            <div className="inline-block min-w-[80px] border border-gray-200 py-2 pr-2 text-right font-bold text-primary-8">
              {protocolDescription.stopTime}
            </div>{' '}
            [ms]
          </div>
        </div>
      </div>
    </div>
  );
}
