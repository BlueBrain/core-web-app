import { useCurrentSimulationReport } from '../../../hooks/current-report';
import NumberInput from '@/components/experiment-interactive/ExperimentInteractive/NumberInput';

export default function StepSize() {
  const simulation = useCurrentSimulationReport();

  return (
    <div className="flex flex-row gap-2">
      Step size
      <NumberInput value={simulation?.delta ?? 0} unit="ms" size={2} min={1} />
    </div>
  );
}
