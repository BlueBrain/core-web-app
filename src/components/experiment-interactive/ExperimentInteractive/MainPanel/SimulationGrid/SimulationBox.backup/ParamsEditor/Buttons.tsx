import { useExperimentInteractive } from '@/components/experiment-interactive/ExperimentInteractive/hooks';
import { useSimulationPreview } from '@/components/experiment-interactive/ExperimentInteractive/MainPanel/SimulationGrid/SimulationBox.backup/hooks';

export default function Buttons() {
  const { isBulkEditingMode } = useExperimentInteractive();

  const { cancelEditing, applyChanges } = useSimulationPreview();

  if (isBulkEditingMode) {
    return null;
  }
  return (
    <div className="flex flex-row justify-end gap-5">
      <button type="button" className="text-sm" onClick={cancelEditing}>
        Cancel
      </button>
      <button
        type="button"
        className="bg-white text-black text-sm font-semibold p-2 px-6 inline-flex"
        onClick={applyChanges}
      >
        Apply
      </button>
    </div>
  );
}
