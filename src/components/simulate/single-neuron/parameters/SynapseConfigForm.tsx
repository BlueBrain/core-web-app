import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Form, InputNumber, Select } from 'antd';
import { SimAction } from '@/types/simulate/single-neuron';

type Props = {
  onChange: (action: SimAction) => void;
  onAddSynapseConfig?: () => void;
  onRemoveSynapseConfig?: (index: number) => void;
  synapses: string[];
};

export default function SynapseConfigForm({
  onRemoveSynapseConfig,
  onAddSynapseConfig,
  onChange,
  synapses,
}: Props) {
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
                onRemoveSynapseConfig && (
                  <DeleteOutlined
                    className="text-error"
                    onClick={() => {
                      remove(field.name);
                      onRemoveSynapseConfig(field.name);
                    }}
                  />
                )
              }
            >
              <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
                <Form.Item
                  name={[field.name, 'synapseId']}
                  label="Synapse Set"
                  rules={[{ required: true }]}
                  labelAlign="left"
                  className="mb-0"
                >
                  <Select
                    showSearch
                    placeholder="Select synapse set"
                    onChange={(newVal) =>
                      onChange({
                        type: 'UPDATE_SYNAPSE',
                        payload: { id: `${field.name}`, key: 'synapseId', value: newVal },
                      })
                    }
                    options={synapses.map((synapse) => ({ value: synapse, label: synapse }))}
                    className="text-left"
                  />
                </Form.Item>
                <Form.Item
                  name={[field.name, 'delay']}
                  label="Delay"
                  rules={[{ required: true }]}
                  labelAlign="left"
                  className="mb-0"
                >
                  <InputNumber<number>
                    addonAfter="ms"
                    className="w-full text-right"
                    type="number"
                    onChange={(newVal) =>
                      onChange({
                        type: 'UPDATE_SYNAPSE',
                        payload: { id: `${field.name}`, key: 'delay', value: newVal ?? 0 },
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  name={[field.name, 'duration']}
                  label="Duration"
                  rules={[{ required: true }]}
                  labelAlign="left"
                  className="mb-0"
                >
                  <InputNumber<number>
                    addonAfter="ms"
                    className="w-full text-right"
                    onChange={(newVal) =>
                      onChange({
                        type: 'UPDATE_SYNAPSE',
                        payload: { id: `${field.name}`, key: 'duration', value: newVal ?? 0 },
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  name={[field.name, 'frequency']}
                  label="Frequency"
                  rules={[{ required: true }]}
                  labelAlign="left"
                  className="mb-0"
                >
                  <InputNumber<number>
                    addonAfter="Hz"
                    className="w-full text-right"
                    onChange={(newVal) =>
                      onChange({
                        type: 'UPDATE_SYNAPSE',
                        payload: { id: `${field.name}`, key: 'frequency', value: newVal ?? 0 },
                      })
                    }
                  />
                </Form.Item>

                <Form.Item
                  name={[field.name, 'weightScalar']}
                  label="Weight Scalar"
                  rules={[{ required: true }]}
                  labelAlign="left"
                  className="mb-0"
                >
                  <InputNumber<number>
                    className="w-full text-right"
                    onChange={(newVal) =>
                      onChange({
                        type: 'UPDATE_SYNAPSE',
                        payload: { id: `${field.name}`, key: 'weightScalar', value: newVal ?? 0 },
                      })
                    }
                  />
                </Form.Item>
              </div>
            </Card>
          ))}
          {onAddSynapseConfig && (
            <Button
              className="m-2 ml-auto w-max bg-green-600 text-white"
              type="primary"
              onClick={() => {
                add();
                onAddSynapseConfig();
              }}
            >
              + Add Synapse Configuration
            </Button>
          )}
        </div>
      )}
    </Form.List>
  );
}
