import { useId, useRef, useState } from 'react';

import { FieldType } from '../../../types';
import { classNames } from '@/util/utils';
import { useModalState } from '@/components/VirtualLab/create/contexts/ModalStateContext';

import styles from './input-text.module.css';

export interface InputTextProps extends FieldType {
  className?: string;
  value: string;
  onChange(value: string): void;
  onValidityChange(validity: boolean): void;
}
export function InputText({
  className,
  value,
  onChange,
  onValidityChange,
  label,
  placeholder,
  type = 'text',
  pattern,
  required,
  title,
  options,
}: InputTextProps) {
  const { setStepTouched } = useModalState();
  const [inputTouched, setInputTouched] = useState(false);
  const refInput = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState('');
  const inputId = useId();
  const listId = useId();
  const list: string[] | undefined = getDataList(options);
  const handleInputChange = () => {
    const input = refInput.current;
    if (!input) return;

    onChange(input.value);
    const validity = input.checkValidity();

    onValidityChange(validity);
    setError(validity ? '' : input.validationMessage);
  };

  const handleMount = (input: HTMLInputElement | null) => {
    refInput.current = input;
    handleInputChange();
  };

  const handleBlur = () => {
    setStepTouched(true);
    setInputTouched(true);
  };

  return (
    <div className={classNames(styles.main, className)}>
      <header>
        <label htmlFor={inputId}>
          {label}
          {required ? '*' : ''}
        </label>
        {inputTouched && error && <div>{error}</div>}
      </header>
      <input
        id={inputId}
        ref={handleMount}
        type={type}
        list={list ? listId : undefined}
        placeholder={placeholder}
        required={required && inputTouched}
        pattern={pattern}
        title={title}
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
      />
      {list && (
        <datalist id={listId}>
          {list.map((option) => (
            // eslint-disable-next-line jsx-a11y/control-has-associated-label
            <option key={option} value={option} />
          ))}
        </datalist>
      )}
    </div>
  );
}

function getDataList(options: string[] | Record<string, string> | undefined): string[] | undefined {
  if (!options) return;

  if (Array.isArray(options)) return options;

  return Object.keys(options);
}
