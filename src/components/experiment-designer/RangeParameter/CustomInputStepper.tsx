import { FormEvent, useState } from 'react';

import GenericStepperInput from './GenericStepperInput';
import type { ExpDesignerRangeParameter } from '@/types/experiment-designer';

function checkValidity(min: number, max: number, value: number) {
  if (Number.isNaN(value)) return false;
  if (value > max) return false;
  if (value < min) return false;
  return true;
}

type CustomInputTypeProps = {
  data: ExpDesignerRangeParameter;
  onChange: (value: number) => void;
  isChecked: boolean;
};

export function NumberOfStepsInput({ data, onChange, isChecked }: CustomInputTypeProps) {
  const [isValid, setIsValid] = useState(true);

  const min = 2;
  const max = 1_000;
  const stepSize = 1;

  const onInput = (e: FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.valueAsNumber;
    setIsValid(checkValidity(min, max, value));
    onChange(value);
  };

  return (
    <GenericStepperInput
      isValid={isValid}
      min={min}
      max={max}
      defaultValue={data.value.stepper.value}
      stepSize={stepSize}
      onInput={onInput}
      isChecked={isChecked}
    />
  );
}

export function StepSizeInput({ data, isChecked, onChange }: CustomInputTypeProps) {
  const [isValid, setIsValid] = useState(true);

  if (!data) return null;

  const min = data.value.step;
  const max = data.value.end - data.value.start;
  const stepSize = data.value.step;

  const onInput = (e: FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.valueAsNumber;
    setIsValid(checkValidity(min, max, value));
    onChange(value);
  };

  return (
    <GenericStepperInput
      isValid={isValid}
      min={min}
      max={max}
      stepSize={stepSize}
      onInput={onInput}
      isChecked={isChecked}
      defaultValue={data.value.stepper.value}
    />
  );
}
