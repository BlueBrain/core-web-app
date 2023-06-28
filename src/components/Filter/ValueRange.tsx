import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'antd/es/form/Form';
import { ConfigProvider, Form, InputNumber } from 'antd';
import { RangeFilter } from '@/components/Filter/types';
import { FilterValues } from '@/types/explore-section/application';
import { Statistics } from '@/types/explore-section/fields';
import ArrowLeftRightIcon from '@/components/icons/ArrowLeftRight';

export default function ValueRange({
  filter,
  aggregation,
  setFilterValues,
}: {
  filter: RangeFilter;
  aggregation: Statistics;
  setFilterValues: Dispatch<SetStateAction<FilterValues>>;
}) {
  const [form] = useForm();

  const submitForm = () => {
    const minValue = form.getFieldValue('min-range');
    const maxValue = form.getFieldValue('max-range');

    setFilterValues((prevState) => ({
      ...prevState,
      [filter.field]: { gte: minValue ?? null, lte: maxValue ?? null },
    }));
  };

  // if there is no min and max value, then the field should be disabled
  const disabled = !aggregation.min && !aggregation.max;
  return (
    <div>
      <ConfigProvider
        theme={{
          token: {
            colorBgContainer: 'transparent',
            colorText: '#40A9FF',
            colorTextDisabled: '#002766',
            colorTextPlaceholder: '#40A9FF',
            colorTextDescription: '#40A9FF',
          },
        }}
      >
        <Form
          className="flex items-center"
          initialValues={{ 'min-range': filter.value.gte, 'max-range': filter.value.lte }}
          form={form}
        >
          <Form.Item name="min-range" noStyle>
            <InputNumber
              disabled={disabled}
              className="text-neutral-2 w-32"
              placeholder="From"
              type="number"
              min={aggregation.min}
              step={0.1}
              max={aggregation.max}
              onChange={submitForm}
            />
          </Form.Item>
          <div className="w-min mx-2">
            <ArrowLeftRightIcon />
          </div>
          <Form.Item name="max-range" noStyle>
            <InputNumber
              disabled={disabled}
              className="text-neutral-2 w-32"
              placeholder="To"
              type="number"
              step={0.1}
              min={aggregation.min}
              max={aggregation.max}
              onChange={submitForm}
            />
          </Form.Item>
          <div className="text-neutral-2 ml-2">{filter.unit}</div>
        </Form>
      </ConfigProvider>
      <div className="text-neutral-2 mt-3 gap-2 flex flex-col">
        <div>
          <strong>Minimum value:</strong> {aggregation.min || 'N/A'}
        </div>
        <div>
          <strong>Maximum value:</strong> {aggregation.max || 'N/A'}
        </div>
      </div>
    </div>
  );
}
