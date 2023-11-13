import { useForm } from 'antd/lib/form/Form';
import { ConfigProvider, Form, InputNumber } from 'antd';
import { GteLteValue, RangeFilter } from '@/components/Filter/types';
import { Statistics } from '@/types/explore-section/fields';
import ArrowLeftRightIcon from '@/components/icons/ArrowLeftRight';
import { formatNumber } from '@/util/common';
import { getFieldUnit } from '@/api/explore-section/fields';

export default function ValueRange({
  filter,
  aggregation,
  onChange,
}: {
  filter: RangeFilter;
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
              className="text-neutral-2 w-32"
              placeholder="From"
              type="number"
              step={0.1}
              onChange={submitForm}
            />
          </Form.Item>
          <div className="w-min mx-2">
            <ArrowLeftRightIcon />
          </div>
          <Form.Item name="max-range" noStyle>
            <InputNumber
              className="text-neutral-2 w-32"
              placeholder="To"
              type="number"
              step={0.1}
              onChange={submitForm}
            />
          </Form.Item>
          <div className="text-neutral-2 ml-2">{getFieldUnit(filter.field)}</div>
        </Form>
      </ConfigProvider>
      <div className="text-neutral-2 mt-3 gap-2 flex flex-col">
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
