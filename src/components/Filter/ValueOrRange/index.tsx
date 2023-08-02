import { ChangeEvent, HTMLProps, useState } from 'react';
import { RangeIcon } from '@/components/icons';
import { GteLteValue, ValueOrRangeFilter } from '@/components/Filter/types';
import LISTING_CONFIG from '@/constants/explore-section/es-terms-render';

function Radio({
  checked,
  children,
  id,
  label,
  onChange,
  value,
}: HTMLProps<HTMLInputElement> & { label: string }) {
  return (
    <div className="flex flex-col gap-2 text-white">
      <label className="cursor-pointer" htmlFor={id}>
        <span className="flex gap-2">
          <input
            checked={checked}
            className="cursor-pointer"
            id={id}
            onChange={onChange}
            type="radio"
            value={value}
          />
          <span className="capitalize text-white">{label}</span>
        </span>
      </label>
      {children}
    </div>
  );
}

export default function ValueOrRange({
  filter,
  setFilter,
}: {
  filter: ValueOrRangeFilter;
  setFilter: (value: ValueOrRangeFilter['value']) => void;
}) {
  const [range, setRange] = useState<GteLteValue>(
    filter.value && Object.prototype.hasOwnProperty.call(filter.value, 'gte')
      ? (filter.value as GteLteValue)
      : {
          gte: null,
          lte: null,
        }
  );

  const [value, setValue] = useState<number | undefined>(
    typeof filter.value === 'number' ? filter.value : undefined
  );

  function getInitialRadio() {
    if (typeof filter.value === 'number') {
      return 'value';
    }

    if (
      !!filter.value &&
      (Object.prototype.hasOwnProperty.call(filter.value, 'gte') ||
        Object.prototype.hasOwnProperty.call(filter.value, 'lte'))
    ) {
      return 'range';
    }

    return 'all';
  }

  type RadioOptions = 'all' | 'value' | 'range';

  const [selectedRadio, setSelectedRadio] = useState<RadioOptions>(getInitialRadio());

  function updateValue(e: ChangeEvent<HTMLInputElement>) {
    const newValue = Number(e.target.value);

    setValue(newValue);
    setFilter(newValue);
  }

  function updateRange(newValue: { [x in keyof Partial<GteLteValue>]: number }) {
    setRange({ ...range, ...newValue });
    setFilter({ ...range, ...newValue });
  }

  function updateFilter(newValue: number | GteLteValue | null, radioValue: RadioOptions) {
    setFilter(newValue);
    setSelectedRadio(radioValue);
  }

  return (
    <fieldset className="flex flex-col gap-4">
      <Radio
        checked={selectedRadio === 'all'}
        label="All"
        onChange={() => updateFilter(null, 'all')}
        value="all"
      />
      <Radio
        checked={selectedRadio === 'value'}
        label="Value"
        onChange={() => updateFilter(value ?? null, 'value')}
        value="value"
      >
        <div className="flex gap-2 items-center justify-between">
          <input
            type="number"
            className="bg-transparent border border-primary-6 flex gap-2 grow px-2 py-2 rounded-md text-sm"
            onChange={updateValue}
            value={value}
          />
          <span>{LISTING_CONFIG[filter.field].unit}</span>
        </div>
      </Radio>
      <Radio
        checked={selectedRadio === 'range'}
        label="Range"
        onChange={() => updateFilter(range, 'range')}
        value="range"
      >
        <div className="flex gap-2 items-center text-sm">
          <input
            className="bg-transparent border border-primary-6 min-w-0 px-2 py-2 rounded-md text-center"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              updateRange({ gte: Number(e.target.value) })
            }
            step={1}
            type="number"
            value={(range.gte as number | null) ?? undefined}
          />
          <RangeIcon className="shrink-0" />
          <input
            className="bg-transparent border border-primary-6 min-w-0 px-2 py-2 rounded-md text-center"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              updateRange({ lte: Number(e.target.value) })
            }
            step={1}
            type="number"
            value={(range.lte as number | null) ?? undefined}
          />
          <span className="shrink-0">{LISTING_CONFIG[filter.field].unit}</span>
        </div>
      </Radio>
    </fieldset>
  );
}
