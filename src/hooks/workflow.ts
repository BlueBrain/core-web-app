'use client';

import { useAtomValue } from 'jotai/react';
import { loadable } from 'jotai/vanilla/utils';

import {
  WORKFLOW_CIRCUIT_BUILD_TASK_NAME,
  WORKFLOW_SIMULATION_TASK_NAME,
  WORKFLOW_VIDEO_GENERATION_TASK_NAME,
  CIRCUIT_BUILDING_FILES,
  SIMULATION_FILES,
  VIDEO_GENERATION_FILES,
  WorkflowFilesType,
} from '@/services/bbp-workflow/config';
import {
  getCircuitBuildingTaskFiles,
  getSimulationTaskFiles,
  getVideoGenerationTaskFiles,
} from '@/services/bbp-workflow';
import { GROUPS as EXECUTION_GROUPS, stepsToBuildAtom } from '@/state/build-status';
import { configAtom } from '@/state/brain-model-config';
import circuitAtom from '@/state/circuit';
import { BrainModelConfigResource } from '@/types/nexus';

function getCircuitUrl(config: BrainModelConfigResource | null): string {
  if (!config?._self) return '';
  return `${config?._self}?rev=${config?._rev}`;
}

export function useWorkflowConfig(workflowName: string): WorkflowFilesType {
  const circuitInfo = useAtomValue(circuitAtom);
  const stepsToBuild = useAtomValue(stepsToBuildAtom);

  let replacedConfigFiles: WorkflowFilesType = [];

  const config = useAtomValue(loadable(configAtom));
  if (config.state !== 'hasData') {
    return replacedConfigFiles;
  }

  const configUrl = getCircuitUrl(config.data);

  switch (workflowName) {
    case WORKFLOW_SIMULATION_TASK_NAME:
      replacedConfigFiles = getSimulationTaskFiles(SIMULATION_FILES, circuitInfo);
      break;

    case WORKFLOW_CIRCUIT_BUILD_TASK_NAME:
      if (stepsToBuild.includes(EXECUTION_GROUPS.CELL_COMPOSITION)) {
        replacedConfigFiles = getCircuitBuildingTaskFiles(CIRCUIT_BUILDING_FILES, configUrl);
      }
      break;

    case WORKFLOW_VIDEO_GENERATION_TASK_NAME:
      // TODO: use getSimulationCampaignConfiguration
      replacedConfigFiles = getVideoGenerationTaskFiles(VIDEO_GENERATION_FILES, '');
      break;

    default:
      replacedConfigFiles = [];
      break;
  }

  return replacedConfigFiles;
}

export default useWorkflowConfig;
