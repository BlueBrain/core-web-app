import { Form, InputNumber } from 'antd';

import { SimAction } from '@/types/simulate/single-neuron';

type Props = {
  onChange: (action: SimAction) => void;
};

export default function Conditions({ onChange }: Props) {
  return (
    <div className="flex gap-6">
      <Form.Item name="tstop" label="Time stop" rules={[{ required: true }]}>
        <InputNumber
          addonAfter="ms"
          className="w-full"
          min={0}
          max={5000}
          onChange={(newVal) =>
            onChange({ type: 'CHANGE_PARAM', payload: { key: 'tstop', value: newVal } })
          }
        />
      </Form.Item>

      <Form.Item name="celsius" label="Temperature" rules={[{ required: true }]}>
        <InputNumber
          addonAfter="°C"
          className="w-full"
          min={20}
          max={40}
          onChange={(newVal) =>
            onChange({ type: 'CHANGE_PARAM', payload: { key: 'celsius', value: newVal } })
          }
        />
      </Form.Item>
      <Form.Item name="vinit" label="Initial voltage" rules={[{ required: true }]}>
        <InputNumber
          addonAfter="mV"
          className="w-full"
          min={-100}
          max={100}
          onChange={(newVal) =>
            onChange({ type: 'CHANGE_PARAM', payload: { key: 'vinit', value: newVal } })
          }
        />
      </Form.Item>

      <Form.Item name="hypamp" label="Holding current" rules={[{ required: true }]}>
        <InputNumber
          addonAfter="nA"
          className="w-full"
          min={-10}
          max={10}
          onChange={(newVal) =>
            onChange({ type: 'CHANGE_PARAM', payload: { key: 'hypamp', value: newVal } })
          }
        />
      </Form.Item>
    </div>
  );
}
