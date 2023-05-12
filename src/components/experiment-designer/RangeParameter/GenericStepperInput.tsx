import { FormEvent } from 'react';

import { classNames } from '@/util/utils';

type GenericStepperInputType = {
  min: number;
  max: number;
  defaultValue?: number;
  stepSize: number;
  isValid: boolean;
  isChecked: boolean;
  onInput: (event: FormEvent<HTMLInputElement>) => void;
};

export default function GenericStepperInput({
  min,
  max,
  defaultValue,
  stepSize,
  isValid,
  isChecked,
  onInput,
}: GenericStepperInputType) {
  const inputDefaultStyle = 'w-[40px] px-1 text-right';
  const inputInvalidStyle = 'bg-red-400';
  const borderStyle = 'border-2 border-solid border-gray rounded-md';
  const validityStyle = isValid ? '' : inputInvalidStyle;
  const inputBaseStyle = classNames(borderStyle, validityStyle, inputDefaultStyle);

  return (
    <>
      {!isChecked && (
        <input
          placeholder="-"
          readOnly
          className={classNames(inputBaseStyle, 'pointer-events-none')}
        />
      )}
      {isChecked && (
        <input
          required
          type="number"
          min={min}
          max={max}
          step={stepSize}
          defaultValue={defaultValue ?? min}
          className={classNames(inputBaseStyle)}
          onInput={onInput}
          onFocus={onInput}
        />
      )}
    </>
  );
}
