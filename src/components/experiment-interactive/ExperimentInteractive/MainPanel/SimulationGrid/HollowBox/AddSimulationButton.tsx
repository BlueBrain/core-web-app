import { useExperimentInteractive } from '@/components/experiment-interactive/ExperimentInteractive/hooks';
import { PlusIcon } from '@/components/icons';

export function AddSimulationButton() {
  const { addNewSimulation } = useExperimentInteractive();
  return (
    <button
      type="button"
      onClick={addNewSimulation}
      className="flex flex-row gap-2 items-center border border-white/30 p-3"
    >
      <PlusIcon />
      Add simulation
    </button>
  );
}
