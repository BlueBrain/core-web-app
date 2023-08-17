import { useAtomValue } from 'jotai';

import { cellCompositionAtom } from '@/state/brain-model-config/cell-composition';
import WorkflowLauncherBtn from '@/components/WorkflowLauncherBtn';
import { WORKFLOW_SIMULATION_TASK_NAME } from '@/services/bbp-workflow/config';
import GenericButton from '@/components/Global/GenericButton';

export function PlaceholderLoadingButton() {
  return (
    <GenericButton
      className="flex-auto text-white bg-slate-400 cursor-not-allowed"
      disabled
      text="Loading..."
    />
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
