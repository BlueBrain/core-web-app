/* eslint-disable react/jsx-props-no-spreading */
import { ReactNode, useRef } from 'react';

import { InputText } from './InputText';
import { FieldType } from '@virtual-lab-create/types';
import { KeysOfType } from '@/util/typing';
import { classNames } from '@/util/utils';

import styles from './form.module.css';

export interface FormProps<T extends Record<string, any>> {
  className?: string;
  value: T;
  onChange(value: T): void;
  onValidityChange(validity: boolean): void;
  fields: Record<KeysOfType<T, string>, FieldType>;
  children?: ReactNode;
}

export function Form<T extends Record<string, any>>({
  className,
  value,
  onChange,
  onValidityChange,
  fields,
  children,
}: FormProps<T>) {
  const refInvalidFields = useRef(new Set<keyof typeof fields>());
  const keys = Object.keys(fields);
  const handleValidityChange = (key: keyof typeof fields, validity: boolean) => {
    const set = refInvalidFields.current;
    if (validity) set.delete(key);
    else set.add(key);
    onValidityChange(set.size === 0);
  };
  return (
    <form className={classNames(styles.main, className)}>
      {keys.map((key) => {
        const attrib = key as keyof typeof fields;
        const props: FieldType = fields[attrib];
        return (
          <InputText
            key={key}
            value={value[attrib]}
            onValidityChange={(validity) => handleValidityChange(attrib, validity)}
            onChange={(data) => {
              if (value[attrib] !== data) {
                onChange({
                  ...value,
                  [attrib]: data,
                });
              }
            }}
            {...props}
          />
        );
      })}
      {children}
    </form>
  );
}
