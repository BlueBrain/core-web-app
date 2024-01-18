import { useMemo } from 'react';
import { ConfigProvider, DatePicker } from 'antd';
import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns'; // eslint-disable-line import/no-extraneous-dependencies
import { RangeValue } from 'rc-picker/lib/interface'; // eslint-disable-line import/no-extraneous-dependencies
import { GteLteValue, DateRangeFilter } from './types';

const DateRangePicker = DatePicker.generatePicker<Date>(dateFnsGenerateConfig);

export default function DateRange({
  filter,
  onChange,
}: {
  filter: DateRangeFilter;
  onChange: (value: GteLteValue) => void;
}) {
  const memoizedRender = useMemo(
    () => (
      <DateRangePicker.RangePicker
        allowClear
        format="DD-MM-YYYY"
        allowEmpty={[true, true]}
        defaultValue={[filter.value.gte as Date, filter.value.lte as Date]}
        className="p-2 bg-transparent border rounded border-primary-4 font-sm placeholder-primary-4 text-primary-4"
        onChange={(newValues: RangeValue<Date>) =>
          onChange({ gte: newValues?.[0] ?? null, lte: newValues?.[1] ?? null })
        }
      />
    ),
    [filter.value.gte, filter.value.lte, onChange]
  );

  return (
    <div className="flex items-center justify-between w-full gap-3">
      <ConfigProvider
        theme={{
          token: {
            colorBgContainer: '#002766',
            colorText: '#40A9FF',
            colorTextDisabled: '#002766',
            colorTextPlaceholder: '#40A9FF',
            colorTextDescription: '#40A9FF',
          },
        }}
      >
        {memoizedRender}
      </ConfigProvider>
    </div>
  );
}
