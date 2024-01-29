import clamp from 'lodash/clamp';

import { useCurrentSimulationReport } from '@experiment-interactive/hooks/current-report';
import BackwardStep from '@/components/icons/BackwardStep';
import NumberInput from '@/components/experiment-interactive/ExperimentInteractive/NumberInput';
import ForwardStep from '@/components/icons/ForwardStep';
import { useSimulationCurrentStep } from '@/state/experiment-interactive';

export default function StepNavigator() {
  const report = useCurrentSimulationReport();
  const [step, setStep] = useSimulationCurrentStep(report);
  if (!report) return null;

  const lastStep = Math.floor((report.end - report.start) / report.delta);
  const stepBackwards = () => setStep(Math.max(0, step - 1));
  const stepForward = () => setStep(Math.min(lastStep, step + 1));
  return (
    <div className="inline-flex items-center gap-3 flex">
      <button type="button" onClick={stepBackwards} aria-label="Step backwards">
        <BackwardStep />
      </button>
      <div className="whitespace-nowrap">
        <NumberInput
          value={step}
          className="font-bold"
          onChange={(value) => setStep(clamp(value, 0, lastStep))}
          size={6}
          min={0}
          max={lastStep}
        />
        / {lastStep}
      </div>
      <button type="button" onClick={stepForward} aria-label="Step forward">
        <ForwardStep />
      </button>
    </div>
  );
}
