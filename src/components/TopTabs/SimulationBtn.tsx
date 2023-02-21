import { useAtomValue } from 'jotai/react';

import detailedCircuitAtom from '@/state/circuit';
import WorkflowLauncherBtn from '@/components/WorkflowLauncherBtn';
import { WORKFLOW_SIMULATION_TASK_NAME } from '@/services/bbp-workflow/config';

export default function SimulationBtn() {
  const detailedCircuit = useAtomValue(detailedCircuitAtom);

  return (
    <div className="mt-px w-[250px] flex">
      <WorkflowLauncherBtn
        buttonText="New in silico experiment"
        workflowName={WORKFLOW_SIMULATION_TASK_NAME}
        disabled={!detailedCircuit}
      />
    </div>
  );
}
