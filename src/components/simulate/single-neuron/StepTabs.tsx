'use client';

import { useAtom } from 'jotai';

import { simulateStepAtom } from '@/state/simulate/single-neuron';
import { SimulateStep } from '@/types/simulate/single-neuron';
import { classNames } from '@/util/utils';

const steps: SimulateStep[] = [
  'stimulation',
  'recording',
  'conditions',
  'analysis',
  'visualization',
  'results',
];

export default function StepTabs() {
  const [simulateStep, setSimulateStep] = useAtom(simulateStepAtom);

  const handleClick = (step: SimulateStep) => {
    setSimulateStep(step);
  };

  const getStyle = (step: SimulateStep) => {
    const selectedOrNotStyle =
      step === simulateStep
        ? 'bg-primary-8 text-white font-bold'
        : 'bg-white text-neutral-4 font-light';

    const commonTabStyle = 'flex-grow border border-l-0 border-neural-2 capitalize';
    return classNames(selectedOrNotStyle, commonTabStyle);
  };

  return (
    <div className="flex h-[36px]">
      {steps.map((step) => (
        <button
          type="button"
          onClick={() => handleClick(step)}
          key={step}
          className={getStyle(step)}
        >
          {step}
        </button>
      ))}
    </div>
  );
}
