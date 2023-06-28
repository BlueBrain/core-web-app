import { ChangeEvent, HTMLProps } from 'react';
import { RangeIcon } from '@/components/icons';
import { FilterType, FilterValues, FilterMethods } from '@/hooks/useFilterList';

function Radio({
  checked,
  children,
  id,
  label,
  onChange,
  value,
}: HTMLProps<HTMLInputElement> & { label: string }) {
  return (
    <label className="cursor-pointer flex flex-col gap-2 text-white" htmlFor={id}>
      <span className="flex gap-2">
        <input
          className="cursor-pointer"
          id={id}
          type="radio"
          onChange={onChange}
          value={value}
          checked={checked}
        />
        <span className="capitalize text-white">{label}</span>
      </span>
      {children}
    </label>
  );
}

function RadioChildren({
  onRangeChange,
  onValueChange,
  option,
  range,
  value,
}: {
  onRangeChange: FilterMethods['onRangeChange'];
  onValueChange: FilterMethods['onValueChange'];
  option: FilterType;
  range: FilterValues['range'];
  value?: FilterValues['value'];
}) {
  function getRangeHandler(type: 'max' | 'min') {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const { value: rangeValue } = e.target;

      return onRangeChange(type, rangeValue !== '' ? Number(rangeValue) : undefined);
    };
  }

  switch (option) {
    case 'value':
      return (
        <input
          type="text"
          className="bg-transparent border border-primary-6 flex gap-2 px-2 py-2 rounded-md text-sm w-24"
          onChange={(e: ChangeEvent<HTMLInputElement>) => onValueChange(e.target.value)}
          value={value}
        />
      );
    case 'range':
      return (
        <div className="flex gap-2 items-center text-sm">
          <input
            className="bg-transparent border border-primary-6 px-2 py-2 rounded-md text-center w-12"
            defaultValue={range.min}
            max={range.max}
            min={range.min}
            onChange={getRangeHandler('min')}
            step={0.1}
            type="number"
          />
          <RangeIcon />
          <input
            className="bg-transparent border border-primary-6 px-2 py-2 rounded-md text-center w-12"
            defaultValue={range.max}
            max={range.max}
            min={range.min}
            onChange={getRangeHandler('max')}
            step={0.1}
            type="number"
          />
        </div>
      );
    default:
      return null;
  }
}

export default function FilterListItem({
  id,
  onRadioChange,
  onRangeChange,
  onValueChange,
  options,
  range,
  type,
  value,
}: {
  id: string;
  onRadioChange: FilterMethods['onRadioChange'];
  onRangeChange: FilterMethods['onRangeChange'];
  onValueChange: FilterMethods['onValueChange'];
  options: FilterType[];
  range: FilterValues['range'];
  type?: FilterType;
  value?: FilterValues['value'];
}) {
  return (
    <fieldset className="flex flex-col gap-4">
      {options.map((option, i) => (
        <Radio
          checked={option === type}
          key={option}
          id={`${id}-${option}`}
          label={option}
          onChange={() => onRadioChange(i, id)}
          value={i}
        >
          <RadioChildren
            onRangeChange={onRangeChange}
            onValueChange={onValueChange}
            option={option}
            range={range}
            value={value}
          />
        </Radio>
      ))}
    </fieldset>
  );
}
