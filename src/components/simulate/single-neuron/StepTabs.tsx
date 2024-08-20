'use client';

import { useAtom } from 'jotai';
import { Steps } from 'antd';

import { simulateStepTrackerAtom } from '@/state/simulate/single-neuron';
import { SimulationType } from '@/types/simulation/common';

export default function StepTabs({ type }: { type: SimulationType }) {
  const [{ steps, current: currentStep }, updateSimulationStep] = useAtom(simulateStepTrackerAtom);
  const items = type === "single-neuron-simulation" ? steps.filter(o => o.title !== "Synaptic inputs") : steps;
  const newCurrentStep = items.findIndex((o) => o.title === currentStep?.title);

  const onChange = (index: number) => {
    const current = items.find((o, i) => i === index)!;
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
      size="small"
      items={items}
      current={newCurrentStep}
      onChange={onChange}
    />
  );
}
