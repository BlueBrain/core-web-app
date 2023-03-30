import { useState } from 'react';

import { classNames } from '@/util/utils';
import type { ExpDesignerRangeParameter } from '@/types/experiment-designer';

type Props = {
  data: ExpDesignerRangeParameter;
  className?: string;
};

type StepString = 'Number of steps' | 'Step size';

type StepperType = {
  name: StepString;
  value: number;
};

const stepOptions: StepString[] = ['Number of steps', 'Step size'];
const selectedStyle = 'text-primary-7 font-bold';
const defaultInputValue = 1;

function generateInputElementId(name1: string, name2: string) {
  return `${name1.replaceAll(' ', '')}${name2.replaceAll(' ', '')}`;
}

export default function Stepper({ data, className }: Props) {
  const [stepper, setStepper] = useState<StepperType>({
    name: 'Number of steps',
    value: defaultInputValue,
  });

  const onChangeStepper = (id: string) => {
    const parentElem = document.getElementById(id);
    const radioElem = parentElem?.querySelector('input[type="radio"]');
    const numInputElem = parentElem?.querySelector('input[type="number"]');

    const inputValue = numInputElem
      ? parseFloat((numInputElem as HTMLInputElement).value)
      : defaultInputValue;
    const selectedStepperName = radioElem ? (radioElem as HTMLInputElement).value : stepOptions[0];

    setStepper({
      name: selectedStepperName as StepString,
      value: inputValue,
    });
  };

  const radioButtons = stepOptions.map((stepperName: string) => {
    const isChecked = stepperName === stepper.name;
    const id = generateInputElementId(data.name, stepperName);
    return (
      <button
        type="button"
        key={stepperName}
        className={classNames('flex gap-1 items-center w-full', isChecked ? selectedStyle : '')}
        id={id}
        onClick={() => onChangeStepper(id)}
      >
        <input
          type="radio"
          value={stepperName}
          onChange={() => onChangeStepper(id)}
          name={`${data.name}stepper`}
          checked={isChecked}
        />
        <span className="text-left grow">{stepperName}</span>
        <input
          type="number"
          defaultValue={stepper.value}
          className={classNames(className, 'w-[30px] px-1 text-right')}
          onChange={isChecked ? () => onChangeStepper(id) : () => {}}
        />
      </button>
    );
  });

  return <div>{radioButtons}</div>;
}
