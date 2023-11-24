import { useMemo } from 'react';
import { loadable } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import { useCustomAnalysisConfig } from '@/hooks/experiment-designer';
import { useAnalyses, Analysis } from '@/app/explore/(content)/simulation-campaigns/shared';

import WorkflowLauncherBtn from '@/components/WorkflowLauncherBtn';
import {
  WORKFLOW_SIMULATION_TASK_NAME,
  SimulationPlaceholders,
} from '@/services/bbp-workflow/config';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import { campaignNameAtom, campaignDescriptionAtom } from '@/state/simulate';
import { expDesignerConfigAtom } from '@/state/experiment-designer';
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

  const selectedAnalyses = useSelectedAnalyses();
  const targets = useTargets();

  const getButtonText = () => {
    switch (circuitInfoLodable.state) {
      case 'loading':
        return 'Loading...';

      case 'hasData':
        return circuitInfo ? 'Simulate' : 'Circuit was not built';

      case 'hasError':
        return 'Error';

      default:
        return 'Circuit was not built';
    }
  };

  const extraVariablesToReplace = {
    expDesignerConfig,
    [SimulationPlaceholders.SIM_CAMPAIGN_NAME]: simCampName,
    [SimulationPlaceholders.SIM_CAMPAIGN_DESCRIPTION]: simCampDescription,
    selectedAnalyses,
    targets,
  };

  const onLaunchingChange = (isLoading: boolean, nexusUrl: string | null) => {
    if (isLoading || !nexusUrl) return;

    onLaunched(nexusUrl);
  };

  return (
    <DefaultLoadingSuspense>
      <WorkflowLauncherBtn
        buttonText={getButtonText()}
        workflowName={WORKFLOW_SIMULATION_TASK_NAME}
        className="px-12"
        extraVariablesToReplace={extraVariablesToReplace}
        disabled={!circuitInfo}
        onLaunchingChange={onLaunchingChange}
      />
    </DefaultLoadingSuspense>
  );
}

function useSelectedAnalyses() {
  const customAnalysisConfig = useCustomAnalysisConfig();

  const [analyses] = useAnalyses();
  const analysisById = useMemo(
    () =>
      analyses.reduce((acc: { [key: string]: Analysis }, a) => {
        acc[a['@id']] = a;
        return acc;
      }, {}),
    [analyses]
  );

  const selectedanalyses = customAnalysisConfig?.value;
  return useMemo(
    () => selectedanalyses?.map((a) => analysisById[a.id]) ?? [],
    [selectedanalyses, analysisById]
  );
}

function useTargets() {
  const customAnalysisConfig = useCustomAnalysisConfig();
  return useMemo(
    () => customAnalysisConfig?.value.map((c) => c.value) ?? [],
    [customAnalysisConfig?.value]
  );
}
