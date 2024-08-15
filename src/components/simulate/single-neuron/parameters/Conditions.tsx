import { Form, InputNumber } from 'antd';

import { useDirectCurrentInjectionSimulationConfig } from '@/state/simulate/categories';

type Props = {
  stimulationId: number;
};

export default function Conditions({ stimulationId }: Props) {
  const { setProperty } = useDirectCurrentInjectionSimulationConfig();

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
          onChange={(newValue) =>
            setProperty({
              id: 0,
              key: 'celsius',
              newValue,
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
          onChange={(newValue) =>
            setProperty({
              id: 0,
              key: 'vinit',
              newValue,
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
          onChange={(newValue) =>
            setProperty({
              id: 0,
              key: 'hypamp',
              newValue,
            })
          }
        />
      </Form.Item>
    </div>
  );
}
