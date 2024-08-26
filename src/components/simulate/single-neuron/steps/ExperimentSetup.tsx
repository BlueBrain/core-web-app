import { Form, InputNumber } from 'antd';

import { useSimulationConditions } from '@/state/simulate/categories';

export default function ExperimentSetup() {
  const { setProperty } = useSimulationConditions();

  return (
    <div className="flex gap-6">
      <Form.Item name={['conditions', 'celsius']} label="Temperature" rules={[{ required: true }]}>
        <InputNumber
          addonAfter="°C"
          className="w-full"
          min={20}
          max={40}
          onChange={(newValue) =>
            setProperty({
              key: 'celsius',
              newValue,
            })
          }
        />
      </Form.Item>
      <Form.Item
        name={['conditions', 'vinit']}
        label="Initial voltage"
        rules={[{ required: true }]}
      >
        <InputNumber
          addonAfter="mV"
          className="w-full"
          min={-100}
          max={100}
          onChange={(newValue) =>
            setProperty({
              key: 'vinit',
              newValue,
            })
          }
        />
      </Form.Item>
      <Form.Item
        name={['conditions', 'hypamp']}
        label="Holding current"
        rules={[{ required: true }]}
      >
        <InputNumber
          addonAfter="nA"
          className="w-full"
          min={-10}
          max={10}
          onChange={(newValue) =>
            setProperty({
              key: 'hypamp',
              newValue,
            })
          }
        />
      </Form.Item>
    </div>
  );
}
