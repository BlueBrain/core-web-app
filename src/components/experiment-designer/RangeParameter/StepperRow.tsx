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
    <div className={classNames('flex gap-1 items-center w-full', isChecked ? selectedStyle : '')}>
      <input
        type="radio"
        value={stepperName}
        onChange={onRadioSelect}
        name="stepper"
        checked={isChecked}
      />
      <button type="button" className="text-left grow cursor-pointer" onClick={onRadioSelect}>
        {stepperName}
      </button>
      {children}
    </div>
  );
}
