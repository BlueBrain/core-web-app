import { Dispatch, SetStateAction, useMemo } from 'react';
import { ConfigProvider, DatePicker } from 'antd';
import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns'; // eslint-disable-line import/no-extraneous-dependencies
import { RangeValue } from 'rc-picker/lib/interface'; // eslint-disable-line import/no-extraneous-dependencies
import { Filter, RangeFilter } from './types';

const DateRangePicker = DatePicker.generatePicker<Date>(dateFnsGenerateConfig);

export default function DateRange({
  filter,
  filters,
  setFilters,
}: {
  filter: RangeFilter;
  filters: Filter[];
  setFilters: Dispatch<SetStateAction<Filter[]>>;
}) {
  const handleRangeChange = useMemo(() => {
    const filterIndex = filters.findIndex((f) => f.field === filter.field);

    return (newValues: RangeValue<Date>) =>
      setFilters([
        ...filters.slice(0, filterIndex),
        {
          field: filter.field,
          title: filter.title,
          type: 'dateRange',
          value: {
            gte: newValues?.[0] ?? null,
            lte: newValues?.[1] ?? null,
          },
        },
        ...filters.slice(filterIndex + 1),
      ]);
  }, [filter, filters, setFilters]);

  const memoizedRender = useMemo(
    () => (
      <DateRangePicker.RangePicker
        allowEmpty={[true, true]}
        className="bg-transparent border border-primary-4 font-sm placeholder-primary-4 p-2 rounded text-primary-4"
        onChange={handleRangeChange}
      />
    ),
    [handleRangeChange]
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
