import { Select, Form, InputNumber } from 'antd';
import { useAtomValue, useSetAtom } from 'jotai';

import AmperageRangeComponent from './AmperageRangeComponent';
import { SimAction, SimConfig } from '@/types/simulate/single-neuron';
import { secNamesAtom } from '@/state/simulate/single-neuron';
import { stimulusTypeParams } from '@/constants/simulate/single-neuron';
import { setStimulusProtcolsAtom } from '@/state/simulate/single-neuron-setter';

type OnChangeProp = {
  onChange: (action: SimAction) => void;
};

type Props = OnChangeProp & {
  simConfig: SimConfig;
};

export default function Stimulation({ onChange, simConfig }: Props) {
  return (
    <>
      <StimulusLocation onChange={onChange} />
      <StimulationMode onChange={onChange} />
      <StimulationProtocol onChange={onChange} simConfig={simConfig} />
      <Parameters onChange={onChange} simConfig={simConfig} />
      <AmperageRangeComponent onChange={onChange} amplitudes={simConfig.stimulus.amplitudes} />
    </>
  );
}

function StimulusLocation({ onChange }: OnChangeProp) {
  const secNames = useAtomValue(secNamesAtom);

  return (
    <Form.Item name="injectTo" label="Location" rules={[{ required: true }]}>
      <Select
        showSearch
        placeholder="Select stimulus location"
        onChange={(newVal) =>
          onChange({ type: 'CHANGE_PARAM', payload: { key: 'injectTo', value: newVal } })
        }
        options={secNames.map((secName) => ({ value: secName, label: secName }))}
        className="text-left"
      />
    </Form.Item>
  );
}

function StimulationMode({ onChange }: OnChangeProp) {
  const stimulusModeClone = structuredClone(stimulusTypeParams);

  return (
    <Form.Item
      name={['stimulus', 'stimulusType']}
      label="Stimulation mode"
      rules={[{ required: true }]}
    >
      <Select
        options={[...stimulusModeClone.options]}
        onSelect={(newVal) => onChange({ type: 'CHANGE_TYPE', payload: newVal })}
        className="text-left"
      />
    </Form.Item>
  );
}

function StimulationProtocol({ onChange, simConfig }: Props) {
  const setStimulusProtcols = useSetAtom(setStimulusProtcolsAtom);

  return (
    <Form.Item
      name={['stimulus', 'stimulusProtocol']}
      label="Protocol"
      rules={[{ required: true }]}
    >
      <Select
        placeholder="Select stimulus protocol"
        options={simConfig.stimulus.stimulusProtocolOptions}
        onSelect={(newVal) => {
          onChange({ type: 'CHANGE_PROTOCOL', payload: newVal });
          setStimulusProtcols(newVal);
        }}
        className="text-left"
      />
    </Form.Item>
  );
}

function Parameters({ onChange, simConfig }: Props) {
  return (
    <div className="flex gap-6">
      {Object.entries(simConfig.stimulus.paramInfo).map(([key, info]) => (
        <Form.Item
          key={key}
          name={['stimulus', 'paramValues', key]}
          label={info.name}
          rules={[{ required: true }]}
          tooltip={info.description}
        >
          <InputNumber
            disabled
            addonAfter={info.unit}
            className="w-full text-right"
            step={info.step}
            min={info.min}
            max={info.max}
            onChange={(newVal) =>
              onChange({ type: 'CHANGE_STIM_PARAM', payload: { key, value: newVal } })
            }
          />
        </Form.Item>
      ))}
    </div>
  );
}
