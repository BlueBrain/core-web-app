import { useAtomValue } from 'jotai/react';

import { cellCompositionAtom } from '@/state/brain-model-config/cell-composition';
import WorkflowLauncherBtn from '@/components/WorkflowLauncherBtn';
import { WORKFLOW_SIMULATION_TASK_NAME } from '@/services/bbp-workflow/config';

export function PlaceholderLoadingButton() {
  return (
    <button
      type="button"
      className="flex-auto text-white h-12 px-8 bg-slate-400 cursor-not-allowed"
    >
      Loading...
    </button>
  );
}

export default function SimulationBtn() {
  const wasBuilt = useAtomValue(cellCompositionAtom);

  return (
    <div className="mt-px w-[250px] flex">
      <WorkflowLauncherBtn
        buttonText="New in silico experiment"
        workflowName={WORKFLOW_SIMULATION_TASK_NAME}
        disabled={!wasBuilt}
      />
    </div>
  );
}
