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
import circuitAtom from '@/state/circuit';

const loadableExpDesAtom = loadable(expDesignerConfigAtom);
const loadableCircuitAtom = loadable(circuitAtom);

type Props = {
  onLaunched: (nexusUrl: string) => void;
};

export default function SimulateBtn({ onLaunched }: Props) {
  const expDesLoadable = useAtomValue(loadableExpDesAtom);
  const simCampName = useAtomValue(campaignNameAtom);
  const simCampDescription = useAtomValue(campaignDescriptionAtom);
  const circuitInfoLodable = useAtomValue(loadableCircuitAtom);

  const expDesignerConfig = expDesLoadable.state === 'hasData' ? expDesLoadable.data : {};
  const circuitInfo = circuitInfoLodable.state === 'hasData' ? circuitInfoLodable.data : null;

  const extraVariablesToReplace = {
    expDesignerConfig,
    [SimulationPlaceholders.SIM_CAMPAIGN_NAME]: simCampName,
    [SimulationPlaceholders.SIM_CAMPAIGN_DESCRIPTION]: simCampDescription,
  };

  const onLaunchingChange = (isLoading: boolean, nexusUrl: string | null) => {
    if (isLoading || !nexusUrl) return;

    onLaunched(nexusUrl);
  };

  return (
    <DefaultLoadingSuspense>
      <WorkflowLauncherBtn
        buttonText={circuitInfo ? 'Simulate' : 'Circuit was not built'}
        workflowName={WORKFLOW_SIMULATION_TASK_NAME}
        className="px-12"
        extraVariablesToReplace={extraVariablesToReplace}
        disabled={!circuitInfo}
        onLaunchingChange={onLaunchingChange}
      />
    </DefaultLoadingSuspense>
  );
}
