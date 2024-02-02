import { useAtomValue } from 'jotai';

import detailedCircuitAtom from '@/state/circuit';
import WorkflowLauncherBtn from '@/components/WorkflowLauncherBtn';
import { WORKFLOW_SIMULATION_TASK_NAME } from '@/services/bbp-workflow/config';
import GenericButton from '@/components/Global/GenericButton';

export function PlaceholderLoadingButton() {
  return (
    <GenericButton
      className="flex-auto cursor-not-allowed bg-slate-400 text-white"
      disabled
      text="Loading..."
    />
  );
}

export default function SimulationBtn() {
  const wasBuilt = useAtomValue(detailedCircuitAtom);

  return (
    <div className="mt-px flex w-[250px]">
      <WorkflowLauncherBtn
        buttonText="New in silico experiment"
        workflowName={WORKFLOW_SIMULATION_TASK_NAME}
        disabled={!wasBuilt}
      />
    </div>
  );
}
