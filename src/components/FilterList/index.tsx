import { ChangeEvent, HTMLProps } from 'react';
import { RangeIcon } from '@/components/icons';
import { FilterType, FilterValues, FilterMethods } from '@/hooks/useFilterList';

function Checkbox({ checked, children, id, onChange }: HTMLProps<HTMLInputElement>) {
  return (
    <label className="cursor-pointer flex gap-2 items-center" htmlFor={id}>
      <input
        className="cursor-pointer"
        checked={checked}
        id={id}
        onChange={onChange}
        type="checkbox"
        value={id}
      />
      <span className="font-bold">{children}</span>
    </label>
  );
}

function Radio({
  checked,
  children,
  id,
  label,
  onChange,
  value,
}: HTMLProps<HTMLInputElement> & { label: string }) {
  return (
    <label className="cursor-pointer flex flex-col gap-2" htmlFor={id}>
      <span className="flex gap-2">
        <input
          className="cursor-pointer"
          id={id}
          type="radio"
          onChange={onChange}
          value={value}
          checked={checked}
        />
        <span className="capitalize">{label}</span>
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
          className="bg-white flex gap-2 px-2 py-2 rounded-md text-sm w-24"
          onChange={(e: ChangeEvent<HTMLInputElement>) => onValueChange(e.target.value)}
          value={value}
        />
      );
    case 'range':
      return (
        <div className="flex gap-2 items-center text-sm">
          <input
            className="bg-white px-2 py-2 rounded-md text-center w-12"
            defaultValue={range.min}
            max={range.max}
            min={range.min}
            onChange={getRangeHandler('min')}
            step={0.1}
            type="number"
          />
          <RangeIcon />
          <input
            className="bg-white px-2 py-2 rounded-md text-center w-12"
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

function FilterListItem({
  checked,
  id,
  label,
  onCheckboxChange,
  onRadioChange,
  onRangeChange,
  onValueChange,
  options,
  range,
  type,
  value,
}: {
  checked: boolean;
  id: string;
  label: string;
  onCheckboxChange: FilterMethods['onCheckboxChange'];
  onRadioChange: FilterMethods['onRadioChange'];
  onRangeChange: FilterMethods['onRangeChange'];
  onValueChange: FilterMethods['onValueChange'];
  options: FilterType[];
  range: FilterValues['range'];
  type?: FilterType;
  value?: FilterValues['value'];
}) {
  return (
    <div className="flex flex-col gap-3 pt-7 text-primary-7">
      <Checkbox checked={checked} id={id} onChange={onCheckboxChange}>
        {label}
      </Checkbox>
      <fieldset className="flex gap-12">
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
    </div>
  );
}

export default function FilterList({
  getValues,
  getMethods,
  items,
  options,
}: {
  getMethods: (id: string) => FilterMethods;
  getValues: (id: string) => FilterValues;
  items: { id: string; label: string }[];
  options: FilterType[];
}) {
  return (
    <div className="divide-neutral-3 divide-y flex flex-col gap-7">
      {items.map(({ id, label }) => {
        const { checked, range, type, value } = getValues(id);
        const { onCheckboxChange, onRadioChange, onRangeChange, onValueChange } = getMethods(id);

        return (
          <FilterListItem
            checked={checked}
            id={id}
            key={id}
            label={label}
            onCheckboxChange={onCheckboxChange}
            onRadioChange={onRadioChange}
            onRangeChange={onRangeChange}
            onValueChange={onValueChange}
            options={options}
            range={range}
            type={type}
            value={value}
          />
        );
      })}
    </div>
  );
}
