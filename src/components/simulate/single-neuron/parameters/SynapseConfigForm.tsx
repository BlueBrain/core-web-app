import { useAtomValue } from 'jotai';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Form, InputNumber, Select } from 'antd';

import { useSynaptomeSimulationConfig } from '@/state/simulate/categories';
import { SynaptomeSimulationInstanceAtom } from '@/state/simulate/categories/simulation-model';

export default function SynapseConfigForm() {
  const { newConfig, remove: removeSynapseConfig, setProperty } = useSynaptomeSimulationConfig();
  const { configuration } = useAtomValue(SynaptomeSimulationInstanceAtom);
  const synapses = configuration?.synapses.map((s) => s.id);

  return (
    <Form.List name="synapses">
      {(fields, { add, remove }) => (
        <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
          {fields.map((field) => (
            <Card
              size="small"
              className="m-2 border border-gray-300"
              title={`Synapse Configuration  ${field.name + 1}`}
              headStyle={{ background: '#e4e4e4' }}
              key={field.key}
              extra={
                <DeleteOutlined
                  className="text-error"
                  onClick={() => {
                    remove(field.name);
                    removeSynapseConfig(field.name);
                  }}
                />
              }
            >
              <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
                <Form.Item
                  name={[field.name, 'synapseId']}
                  label="Synapse Set"
                  rules={[{ required: true, type: 'string' }]}
                  labelAlign="left"
                  className="mb-0"
                >
                  <Select
                    showSearch
                    placeholder="Select synapse set"
                    onChange={(newValue) =>
                      setProperty({
                        id: `${field.name}`,
                        key: 'synapseId',
                        newValue,
                      })
                    }
                    options={synapses?.map((synapse) => ({ value: synapse, label: synapse })) ?? []}
                    className="text-left"
                  />
                </Form.Item>
                <Form.Item
                  name={[field.name, 'delay']}
                  label="Delay"
                  rules={[{ required: true, type: 'number' }]}
                  labelAlign="left"
                  className="mb-0"
                >
                  <InputNumber<number>
                    addonAfter="ms"
                    className="w-full text-right"
                    type="number"
                    onChange={(newVal) =>
                      setProperty({
                        id: `${field.name}`,
                        key: 'delay',
                        newValue: newVal ?? 0,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  name={[field.name, 'duration']}
                  label="Duration"
                  rules={[{ required: true, type: 'number' }]}
                  labelAlign="left"
                  className="mb-0"
                >
                  <InputNumber<number>
                    addonAfter="ms"
                    className="w-full text-right"
                    onChange={(newVal) =>
                      setProperty({
                        id: `${field.name}`,
                        key: 'duration',
                        newValue: newVal ?? 0,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  name={[field.name, 'frequency']}
                  label="Frequency"
                  rules={[{ required: true, type: 'number' }]}
                  labelAlign="left"
                  className="mb-0"
                >
                  <InputNumber<number>
                    addonAfter="Hz"
                    className="w-full text-right"
                    onChange={(newVal) =>
                      setProperty({
                        id: `${field.name}`,
                        key: 'frequency',
                        newValue: newVal ?? 0,
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  name={[field.name, 'weightScalar']}
                  label="Weight Scalar"
                  rules={[{ required: true, type: 'number' }]}
                  labelAlign="left"
                  className="mb-0"
                >
                  <InputNumber<number>
                    className="w-full text-right"
                    onChange={(newVal) =>
                      setProperty({
                        id: `${field.name}`,
                        key: 'weightScalar',
                        newValue: newVal ?? 0,
                      })
                    }
                  />
                </Form.Item>
              </div>
            </Card>
          ))}
          <Button
            className="m-2 ml-auto w-max bg-green-600 text-white"
            type="primary"
            onClick={() => {
              add();
              if (configuration?.synapses) {
                newConfig(configuration.synapses);
              }
            }}
          >
            + Add Synapse Configuration
          </Button>
        </div>
      )}
    </Form.List>
  );
}
