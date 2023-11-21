import { ChangeEvent, useId } from 'react';
import { classNames } from '@/util/utils';

import styles from './select.module.css';

export interface SelectProps<T extends string> {
  className?: string;
  label: string;
  placeholder?: string;
  options: Record<T, string> | string[];
  value: string;
  onChange(value: T): void;
}

export function Select<T extends string>({
  className,
  label,
  placeholder,
  options,
  value,
  onChange,
}: SelectProps<T>) {
  const id = useId();
  const handleChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    onChange(evt.target.value as T);
  };
  const items = expandOptions(options);
  return (
    <div className={classNames(styles.main, className)}>
      <label htmlFor={id}>{label}</label>
      <select id={id} placeholder={placeholder} value={value} onChange={handleChange}>
        {Object.keys(items).map((key) => (
          <option key={key} value={key}>
            {items[key]}
          </option>
        ))}
      </select>
    </div>
  );
}

function expandOptions(options: Record<string, string> | string[]): Record<string, string> {
  if (!Array.isArray(options)) return options;

  const result: Record<string, string> = {};
  options.forEach((item) => {
    result[item] = item;
  });
  return result;
}
