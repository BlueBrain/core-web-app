'use client';

import { useAtom } from 'jotai';
import { CheckCircleFilled, LoadingOutlined } from '@ant-design/icons';

import { simulateStepTrackerAtom } from '@/state/simulate/single-neuron';
import { SimulationStep, SimulationType } from '@/types/simulation/common';
import { classNames } from '@/util/utils';

type StepProps = SimulationStep & {
  index: number;
  current: SimulationStep;
  onChange: (index: number) => void;
};

function Step({ index, title, status, current, onChange }: StepProps) {
  const isCurrentStep = current.title === title;
  return (
    <button
      aria-label={`${title}`}
      className={classNames(
        'flex items-center justify-center gap-2 border-l border-gray-300 px-3 py-3 text-lg',
        'disabled:cursor-not-allowed disabled:bg-gray-100',
        isCurrentStep && 'bg-primary-8 font-bold text-white',
        !isCurrentStep && status === 'error' && 'text-red-500',
        !isCurrentStep && status !== 'error' && 'bg-white font-light text-black'
      )}
      onClick={() => onChange(index)}
      type="button"
      disabled={status === 'wait'}
    >
      <div>{title}</div>
      {status === 'process' && <LoadingOutlined className="text-primary-4" />}
      {status !== 'process' && (
        <CheckCircleFilled
          className={classNames(
            status === 'error' && 'text-red-500',
            (status === 'finish' || !status) && 'text-primary-4',
            status === 'wait' && 'text-gray-500'
          )}
        />
      )}
    </button>
  );
}

export default function StepTabs({ type }: { type: SimulationType }) {
  const [{ steps, current: currentStep }, updateSimulationStep] = useAtom(simulateStepTrackerAtom);
  const items =
    type === 'single-neuron-simulation'
      ? steps.filter((o) => o.title !== 'Synaptic inputs')
      : steps;

  const onChange = (index: number) => {
    const current = items.find((o, i) => i === index)!;
    updateSimulationStep({
      steps,
      current,
    });
  };

  return (
    <div className="grid w-full grid-flow-col items-center border-b border-gray-300">
      {items.map((s, idx) => (
        <Step
          key={`step-${s.title}`}
          index={idx}
          title={s.title}
          status={s.status}
          current={currentStep}
          onChange={onChange}
        />
      ))}
    </div>
  );
}
