import { Form, InputNumber } from 'antd';

import { SimAction } from '@/types/simulate/single-neuron';

type Props = {
  onChange: (action: SimAction) => void;
  stimulationId: number;
};

export default function Conditions({ onChange, stimulationId }: Props) {
  return (
    <div className="flex gap-6">
      <Form.Item
        name={['directStimulation', stimulationId, 'celsius']}
        label="Temperature"
        rules={[{ required: true }]}
      >
        <InputNumber
          addonAfter="°C"
          className="w-full"
          min={20}
          max={40}
          onChange={(newVal) =>
            onChange({
              type: 'CHANGE_DIRECT_STIM_PROPERTY',
              payload: { key: 'celsius', value: newVal, stimulationId: '0' },
            })
          }
        />
      </Form.Item>
      <Form.Item
        name={['directStimulation', stimulationId, 'vinit']}
        label="Initial voltage"
        rules={[{ required: true }]}
      >
        <InputNumber
          addonAfter="mV"
          className="w-full"
          min={-100}
          max={100}
          onChange={(newVal) =>
            onChange({
              type: 'CHANGE_DIRECT_STIM_PROPERTY',
              payload: { key: 'vinit', value: newVal, stimulationId: '0' },
            })
          }
        />
      </Form.Item>

      <Form.Item
        name={['directStimulation', stimulationId, 'hypamp']}
        label="Holding current"
        rules={[{ required: true }]}
      >
        <InputNumber
          addonAfter="nA"
          className="w-full"
          min={-10}
          max={10}
          onChange={(newVal) =>
            onChange({
              type: 'CHANGE_DIRECT_STIM_PROPERTY',
              payload: { key: 'hypamp', value: newVal, stimulationId: '0' },
            })
          }
        />
      </Form.Item>
    </div>
  );
}
