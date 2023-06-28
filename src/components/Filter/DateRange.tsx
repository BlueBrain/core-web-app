import { Dispatch, SetStateAction, useMemo } from 'react';
import { ConfigProvider, DatePicker } from 'antd';
import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns'; // eslint-disable-line import/no-extraneous-dependencies
import { RangeValue } from 'rc-picker/lib/interface'; // eslint-disable-line import/no-extraneous-dependencies
import { RangeFilter } from './types';
import { FilterValues } from '@/types/explore-section/application';

const DateRangePicker = DatePicker.generatePicker<Date>(dateFnsGenerateConfig);

export default function DateRange({
  filter,
  setFilterValues,
}: {
  filter: RangeFilter;
  setFilterValues: Dispatch<SetStateAction<FilterValues>>;
}) {
  const handleRangeChange = useMemo(
    () => (newValues: RangeValue<Date>) => {
      setFilterValues((prevState) => ({
        ...prevState,
        [filter.field]: { gte: newValues?.[0] ?? null, lte: newValues?.[1] ?? null },
      }));
    },
    [filter.field, setFilterValues]
  );
  const memoizedRender = useMemo(
    () => (
      <DateRangePicker.RangePicker
        allowClear
        allowEmpty={[true, true]}
        defaultValue={[filter.value.gte as Date, filter.value.lte as Date]}
        className="bg-transparent border border-primary-4 font-sm placeholder-primary-4 p-2 rounded text-primary-4"
        onChange={handleRangeChange}
      />
    ),
    [filter.value.gte, filter.value.lte, handleRangeChange]
  );

  return (
    <div className="flex gap-3 items-center justify-between w-full">
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
