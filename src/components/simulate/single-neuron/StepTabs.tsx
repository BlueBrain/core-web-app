'use client';

import { useAtom } from 'jotai';
import { Steps } from 'antd';

import { simulateStepTrackerAtom } from '@/state/simulate/single-neuron';

export default function StepTabs() {
  const [{ steps, current: currentStep }, updateSimulationStep] = useAtom(simulateStepTrackerAtom);
  const newCurrentStep = steps.findIndex((o) => o.title === currentStep?.title);

  const onChange = (index: number) => {
    const current = steps.find((o, i) => i === index)!;
    updateSimulationStep({
      steps,
      current,
    });
  };

  return (
    <Steps
      responsive
      type="navigation"
      className="my-1 px-1 [&_.ant-steps-item-active]:before:!hidden [&_.ant-steps-item-title]:capitalize"
      size="default"
      current={newCurrentStep}
      onChange={onChange}
      items={steps.map(({ title, status }) => ({
        title,
        status,
      }))}
    />
  );
}
