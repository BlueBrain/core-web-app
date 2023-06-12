import { useForm } from 'antd/es/form/Form';
import { Form, Input, Radio } from 'antd';
import { useSetAtom } from 'jotai';
import { modifyDimensionValue } from '@/components/explore-section/Simulations/state';
import {
  DimensionBoxEditFormProps,
  DimensionRange,
  DimensionValue,
} from '@/components/explore-section/Simulations/types';

export default function DimensionBoxEditForm({
  dimension,
  setEditMode,
}: DimensionBoxEditFormProps) {
  const [form] = useForm();
  const dimensionValueModified = useSetAtom(modifyDimensionValue);

  const finishFormEvent = (e: any) => {
    if (e.key === 'Enter') {
      form
        .validateFields(['input-type', 'input-value', 'input-range-min', 'input-range-max'])
        .then(() => {
          const values = form.getFieldsValue();
          let dimensionValue: DimensionValue | DimensionRange;
          if (values['input-type'] === 'value') {
            dimensionValue = {
              type: 'value',
              value: values['input-value'],
            };
          } else {
            dimensionValue = {
              type: 'range',
              minValue: values['input-range-min'],
              maxValue: values['input-range-max'],
            };
          }
          dimensionValueModified(dimension.id, dimensionValue);
          setEditMode(false);
        });
    }
  };

  const setInitialValues = () => {
    if (dimension.value.type === 'value') {
      return {
        'input-type': 'value',
        'input-value': dimension.value.value,
        'input-range-min': 0,
        'input-range-max': 0,
      };
    }
    return {
      'input-type': 'range',
      'input-value': 0,
      'input-range-min': dimension.value.minValue,
      'input-range-max': dimension.value.maxValue,
    };
  };

  return (
    <div className="mt-1">
      <Form initialValues={setInitialValues()} form={form}>
        <div>
          <Form.Item name="input-type" className="mb-0">
            <Radio.Group className="flex">
              <Radio value="value" className="flex-1">
                Value
              </Radio>
              <Radio value="range" className="flex-1">
                Range
              </Radio>
            </Radio.Group>
          </Form.Item>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <Form.Item
              name="input-value"
              rules={[
                {
                  pattern: /^(\s*-?\d+(\.\d+)?)(\s*,\s*-?\d+(\.\d+)?)*$/,
                  message: 'Please fill a correct comma separated value',
                },
              ]}
            >
              <Input size="small" type="text" onKeyDown={finishFormEvent} />
            </Form.Item>
          </div>
          <div className="flex-1">
            <div className="flex gap-2">
              <Form.Item
                className="flex-1"
                name="input-range-min"
                rules={[
                  {
                    pattern: /(\d+(?:\.\d+)?)/,
                    message: 'Please fill a correct integer or float',
                  },
                ]}
              >
                <Input size="small" type="text" onKeyDown={finishFormEvent} />
              </Form.Item>
              <Form.Item
                className="flex-1"
                name="input-range-max"
                rules={[
                  {
                    pattern: /(\d+(?:\.\d+)?)/,
                    message: 'Please fill a correct integer or float',
                  },
                ]}
              >
                <Input size="small" type="text" onKeyDown={finishFormEvent} />
              </Form.Item>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}
