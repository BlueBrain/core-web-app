import { ReactNode } from 'react';

import { classNames } from '@/util/utils';

const selectedStyle = 'text-primary-7 font-bold';

type StepperRowProps = {
  children: ReactNode;
  isChecked: boolean;
  onRadioSelect: any;
  stepperName: string;
};

export default function StepperRow({
  children,
  isChecked,
  onRadioSelect,
  stepperName,
}: StepperRowProps) {
  return (
    <div className={classNames('flex w-full items-center gap-1', isChecked ? selectedStyle : '')}>
      <input
        type="radio"
        value={stepperName}
        onChange={onRadioSelect}
        name="stepper"
        checked={isChecked}
      />
      <button type="button" className="grow cursor-pointer text-left" onClick={onRadioSelect}>
        {stepperName}
      </button>
      {children}
    </div>
  );
}
