import { Dispatch, SetStateAction, useMemo } from 'react';
import { useForm } from 'antd/es/form/Form';
import { ConfigProvider, Form, InputNumber } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { Filter, RangeFilter } from '@/components/Filter/types';
import { StatsAggregation } from '@/types/explore-section/fields';

export default function ValueRange({
  filter,
  filters,
  setFilters,
  aggregation,
}: {
  filter: RangeFilter;
  filters: Filter[];
  setFilters: Dispatch<SetStateAction<Filter[]>>;
  aggregation: StatsAggregation;
}) {
  const [form] = useForm();
  const [min, max] = useMemo(() => {
    if ('min' in aggregation && 'max' in aggregation) {
      return [aggregation.min as number, aggregation.max as number];
    }
    if (filter.field in aggregation) {
      return [aggregation[filter.field].min, aggregation[filter.field].max];
    }
    return [undefined, undefined];
  }, [aggregation, filter.field]);

  const submitForm = () => {
    const minValue = form.getFieldValue('min-range');
    const maxValue = form.getFieldValue('max-range');
    const filterIndex = filters.findIndex((f) => f.field === filter.field);

    setFilters([
      ...filters.slice(0, filterIndex),
      {
        ...filter,
        field: filter.field,
        title: filter.title,
        type: 'valueRange',
        value: {
          gte: minValue ?? null,
          lte: maxValue ?? null,
        },
      },
      ...filters.slice(filterIndex + 1),
    ]);
  };

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
          <Form.Item name="min-range" className="mb-0">
            <InputNumber
              className="text-neutral-2 w-32"
              placeholder="From"
              type="number"
              min={min}
              max={max}
              onPressEnter={submitForm}
            />
          </Form.Item>
          <SwapOutlined className="text-neutral-2 mx-2" />
          <Form.Item name="max-range" className="mb-0">
            <InputNumber
              className="text-neutral-2 w-32"
              placeholder="To"
              type="number"
              min={min}
              max={max}
              onPressEnter={submitForm}
            />
          </Form.Item>
          <div className="text-neutral-2 ml-2">{filter.unit}</div>
        </Form>
      </ConfigProvider>
      <div className="text-neutral-2 mt-3 gap-2 flex flex-col">
        <div>
          <strong>Minimum value:</strong> {min || 'N/A'}
        </div>
        <div>
          <strong>Maximum value:</strong> {max || 'N/A'}
        </div>
      </div>
    </div>
  );
}
