import { Form, InputNumber } from 'antd';

import { useSimulationConditions } from '@/state/simulate/categories';
import { SimulationConditions } from '@/types/simulation/single-neuron';

type SetupInputProps = {
  name: keyof SimulationConditions;
  text: string;
  unit?: string;
  min: number;
  max: number;
  onChange: ({
    key,
    newValue,
  }: {
    key: keyof SimulationConditions;
    newValue: number | null;
  }) => void;
};

const CONDITIONS_FIELDS: Array<Omit<SetupInputProps, 'onChange'>> = [
  {
    name: 'celsius',
    text: 'Temperature',
    unit: '°C',
    min: 20,
    max: 40,
  },
  {
    name: 'vinit',
    text: 'Voltage initial',
    unit: 'mv',
    min: -100,
    max: 100,
  },
  {
    name: 'hypamp',
    text: 'Holding current',
    unit: 'nA',
    min: 20,
    max: 40,
  },
  {
    name: 'max_time',
    text: 'Simulation duration',
    unit: 'ms',
    min: 0,
    max: Infinity,
  },
  {
    name: 'time_step',
    text: 'Time Step',
    unit: 'ms',
    min: 0,
    max: Infinity,
  },
  {
    name: 'seed',
    text: 'seed',
    min: 0,
    max: Infinity,
  },
];

function SetupInput({ name, text, unit, min, max, onChange }: SetupInputProps) {
  return (
    <div className="flex flex-col items-start justify-center">
      <div className="text-base font-light uppercase text-neutral-4">{text}</div>
      <div className="flex w-max max-w-[120px] flex-row flex-nowrap items-center justify-center gap-2">
        <Form.Item
          name={['conditions', name]}
          rules={[{ required: true, message: 'Required field' }]}
        >
          <InputNumber
            className="w-full !rounded-sm border !border-neutral-4 font-bold [&_.ant-input-number-input]:!text-base [&_.ant-input-number-input]:!text-primary-8"
            min={min}
            max={max}
            onChange={(newValue) =>
              onChange({
                key: name,
                newValue,
              })
            }
          />
        </Form.Item>
        {unit && <span className="mb-[24px] text-base font-light text-neutral-4">{unit}</span>}
      </div>
    </div>
  );
}

export default function ExperimentSetup() {
  const { setProperty } = useSimulationConditions();

  return (
    <div className="grid grid-cols-3 gap-2">
      {CONDITIONS_FIELDS.map(({ max, min, name, text, unit }) => (
        <SetupInput
          key={`exper-setup-${name}`}
          {...{
            name,
            text,
            unit,
            min,
            max,
            onChange: setProperty,
          }}
        />
      ))}
    </div>
  );
}
