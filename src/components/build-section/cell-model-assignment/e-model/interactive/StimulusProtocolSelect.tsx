import { Form, InputNumber, Select } from 'antd';

import { StimulusConfig } from './types';
import {
  stimulusModuleParams,
  stimulusTypeParams,
} from '@/constants/cell-model-assignment/e-model-protocols';

const stimulusTypeClone = structuredClone(stimulusTypeParams);
const stimulusModuleClone = structuredClone(stimulusModuleParams);

type Props = {
  stimConfig: StimulusConfig;
  dispatch: any;
};

export default function StimulusProtocolSelect({ stimConfig, dispatch }: Props) {
  return (
    <>
      <Form.Item
        name={['stimulus', 'stimulusType']}
        label={stimulusTypeClone.name}
        rules={[{ required: true }]}
      >
        <Select
          placeholder="Select stimulus type"
          options={[...stimulusTypeClone.options]}
          onSelect={(newVal) => dispatch({ type: 'CHANGE_TYPE', payload: newVal })}
          size="small"
        />
      </Form.Item>

      <Form.Item
        name={['stimulus', 'stimulusProtocol']}
        label={stimulusModuleClone.name}
        rules={[{ required: true }]}
      >
        <Select
          placeholder="Select stimulus protocol"
          options={stimConfig.stimulusProtocolOptions}
          onSelect={(newVal) => dispatch({ type: 'CHANGE_PROTOCOL', payload: newVal })}
          size="small"
        />
      </Form.Item>

      {stimConfig.stimulusProtocolInfo && (
        <div>
          <div className="text-lg font-bold">{stimConfig.stimulusProtocolInfo.label}</div>
          <div>{stimConfig.stimulusProtocolInfo.description}</div>
          <a
            href="https://github.com/BlueBrain/BluePyEModel/tree/main/bluepyemodel/ecode"
            className="underline"
          >
            More information →
          </a>
        </div>
      )}

      {Object.entries(stimConfig.paramInfo).map(([key, info]) => (
        <Form.Item
          key={key}
          name={['stimulus', 'paramValues', key]}
          label={info.name}
          rules={[{ required: true }]}
          tooltip={info.description}
        >
          <InputNumber
            size="small"
            addonAfter={info.unit}
            step={info.step}
            min={info.min}
            max={info.max}
            onChange={(newVal) =>
              dispatch({ type: 'CHANGE_STIM_PARAM', payload: { key, value: newVal } })
            }
          />
        </Form.Item>
      ))}
    </>
  );
}
