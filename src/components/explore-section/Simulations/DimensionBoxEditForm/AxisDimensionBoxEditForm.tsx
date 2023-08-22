import { useForm } from 'antd/es/form/Form';
import { useAtomValue, useSetAtom } from 'jotai';
import { useMemo } from 'react';
import { Form, Input, Radio } from 'antd';
import { modifyDimensionValue } from '@/components/explore-section/Simulations/state';
import { simulationCampaignDimensionsAtom } from '@/state/explore-section/simulation-campaign';
import {
  AxisDimensionBoxEditFormProps,
  DimensionRange,
  DimensionValue,
} from '@/components/explore-section/Simulations/types';

/* eslint-disable prefer-regex-literals */

export default function AxisDimensionBoxEditForm({
  dimension,
  setEditMode,
}: AxisDimensionBoxEditFormProps) {
  const [form] = useForm();
  const dimensionValueModified = useSetAtom(modifyDimensionValue);

  const simulationCampaignDimensions = useAtomValue(simulationCampaignDimensionsAtom);

  const valueRange: DimensionRange | null = useMemo(() => {
    const dimensionConfig =
      simulationCampaignDimensions && simulationCampaignDimensions[dimension?.id];

    if (!dimensionConfig) return null;
    return {
      type: 'range',
      minValue: dimensionConfig[0],
      maxValue: dimensionConfig[dimensionConfig.length - 1],
      step: '0.1',
    };
  }, [dimension?.id, simulationCampaignDimensions]);

  const finishFormEvent = (e: any) => {
    if (e.key === 'Enter') {
      form
        .validateFields([
          'input-type',
          'input-value',
          'input-range-min',
          'input-range-max',
          'input-range-step',
        ])
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
              step: values['input-range-step'],
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
      };
    }
    return {
      'input-type': 'range',
      'input-value': 0,
      'input-range-min': dimension.value.minValue,
      'input-range-max': dimension.value.maxValue,
      'input-range-step': dimension.value.step,
    };
  };

  /**
   * Validator for minmax values
   *
   * @param rule
   * @param value
   */
  const minMaxValueValidator = (rule: any, value: string) => {
    if (
      valueRange?.minValue === undefined ||
      valueRange?.maxValue === undefined ||
      !value ||
      form.getFieldValue('input-type') === 'value'
    ) {
      return Promise.resolve();
    }
    // if the value is not an integer or a float, reject it
    const regex = new RegExp(/(\d+(?:\.\d+)?)/);
    if (!regex.test(value)) {
      return Promise.reject(new Error('Please fill a correct integer or float'));
    }

    if (
      rule.field === 'input-range-min' &&
      Number.parseFloat(value) < Number.parseFloat(valueRange.minValue)
    ) {
      return Promise.reject(new Error(`Minimum value should be ≥ ${valueRange.minValue}`));
    }
    if (
      rule.field === 'input-range-max' &&
      Number.parseFloat(value) > Number.parseFloat(valueRange.maxValue)
    ) {
      return Promise.reject(new Error(`Maximum value should be ≤ ${valueRange.maxValue}`));
    }

    return Promise.resolve();
  };

  const stepValueValidator = (rule: any, value: string) => {
    const regex = new RegExp(/(\d+(?:\.\d+)?)/);
    if (!regex.test(value)) {
      return Promise.reject(new Error('Please fill a correct integer or float'));
    }
    return Promise.resolve();
  };

  /**
   * Validator for value type values
   *
   * @param rule
   * @param value
   */
  const valueValidator = (rule: any, value: string) => {
    if (
      valueRange?.minValue === undefined ||
      valueRange?.maxValue === undefined ||
      !value ||
      form.getFieldValue('input-type') === 'range'
    ) {
      return Promise.resolve();
    }

    // if the value does not follow a comma-separated numeric values, reject it
    const regex = new RegExp(/^(\s*-?\d+(\.\d+)?)(\s*,\s*-?\d+(\.\d+)?)*$/);
    if (!regex.test(value)) {
      return Promise.reject(new Error(`Please fill a correct comma separated value`));
    }

    const valuesCorrect = value
      .split(',')
      .every(
        (val) =>
          Number.parseFloat(val) <= Number.parseFloat(valueRange.maxValue) &&
          Number.parseFloat(val) >= Number.parseFloat(valueRange.minValue)
      );
    if (!valuesCorrect) {
      return Promise.reject(
        new Error(
          `Comma separated values should be ≥ ${valueRange.minValue} and ≤ ${valueRange.maxValue}`
        )
      );
    }
    return Promise.resolve();
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
                  validator: valueValidator,
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
                    validator: minMaxValueValidator,
                  },
                ]}
              >
                <Input size="small" type="text" onKeyDown={finishFormEvent} placeholder="min" />
              </Form.Item>
              <Form.Item
                className="flex-1"
                name="input-range-max"
                rules={[
                  {
                    validator: minMaxValueValidator,
                  },
                ]}
              >
                <Input size="small" type="text" onKeyDown={finishFormEvent} placeholder="max" />
              </Form.Item>
              <Form.Item
                className="flex-1"
                name="input-range-step"
                rules={[
                  {
                    validator: stepValueValidator,
                  },
                ]}
              >
                <Input size="small" type="text" onKeyDown={finishFormEvent} placeholder="step" />
              </Form.Item>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}
