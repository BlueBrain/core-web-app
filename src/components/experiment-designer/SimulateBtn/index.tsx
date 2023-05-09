import { loadable } from 'jotai/utils';
import { useAtomValue } from 'jotai';

import WorkflowLauncherBtn from '@/components/WorkflowLauncherBtn';
import {
  WORKFLOW_SIMULATION_TASK_NAME,
  SimulationPlaceholders,
} from '@/services/bbp-workflow/config';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import {
  campaignNameAtom,
  campaignDescriptionAtom,
  expDesignerConfigAtom,
} from '@/state/experiment-designer';

const loadableExpDesAtom = loadable(expDesignerConfigAtom);

export default function SimulateBtn() {
  const expDesLoadable = useAtomValue(loadableExpDesAtom);
  const simCampName = useAtomValue(campaignNameAtom);
  const simCampDescription = useAtomValue(campaignDescriptionAtom);

  const expDesignerConfig = expDesLoadable.state === 'hasData' ? expDesLoadable.data : [];

  const extraVariablesToReplace = {
    expDesignerConfig,
    [SimulationPlaceholders.SIM_CAMPAIGN_NAME]: simCampName,
    [SimulationPlaceholders.SIM_CAMPAIGN_DESCRIPTION]: simCampDescription,
  };

  return (
    <DefaultLoadingSuspense>
      <WorkflowLauncherBtn
        buttonText="Simulate"
        workflowName={WORKFLOW_SIMULATION_TASK_NAME}
        className="px-12"
        extraVariablesToReplace={extraVariablesToReplace}
      />
    </DefaultLoadingSuspense>
  );
}
