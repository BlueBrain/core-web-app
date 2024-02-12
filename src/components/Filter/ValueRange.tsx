import { useForm } from 'antd/lib/form/Form';
import { ConfigProvider, Form, InputNumber } from 'antd';
import { GteLteValue, ValueFilter } from '@/components/Filter/types';
import { Statistics } from '@/types/explore-section/es-aggs';
import ArrowLeftRightIcon from '@/components/icons/ArrowLeftRight';
import { formatNumber } from '@/util/common';
import { getFieldUnit } from '@/api/explore-section/fields';

export default function ValueRange({
  filter,
  aggregation,
  onChange,
}: {
  filter: ValueFilter;
  aggregation: Statistics;
  onChange: (value: GteLteValue) => void;
}) {
  const [form] = useForm();

  const submitForm = () => {
    const minValue = form.getFieldValue('min-range');
    const maxValue = form.getFieldValue('max-range');

    onChange({ gte: minValue ?? null, lte: maxValue ?? null });
  };

  // if there is no min and max value, then the field should be disabled
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
              className="w-32 text-neutral-2"
              placeholder="From"
              type="number"
              step={0.1}
              onChange={submitForm}
            />
          </Form.Item>
          <div className="mx-2 w-min">
            <ArrowLeftRightIcon />
          </div>
          <Form.Item name="max-range" noStyle>
            <InputNumber
              className="w-32 text-neutral-2"
              placeholder="To"
              type="number"
              step={0.1}
              onChange={submitForm}
            />
          </Form.Item>
          <div className="ml-2 text-neutral-2">{getFieldUnit(filter.field)}</div>
        </Form>
      </ConfigProvider>
      <div className="mt-3 flex flex-col gap-2 text-neutral-2">
        <div>
          <strong>Minimum:</strong> {aggregation.min ? formatNumber(aggregation.min) : 'N/A'}
        </div>
        <div>
          <strong>Maximum:</strong> {aggregation.max ? formatNumber(aggregation.max) : 'N/A'}
        </div>
      </div>
    </div>
  );
}
