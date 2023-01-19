'use client';

import { useAtomValue } from 'jotai/react';
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
import { GROUPS as EXECUTION_GROUPS } from '@/state/build-status';

import { cellCompositionStepsToBuildAtom } from '@/state/brain-model-config/cell-composition';
import { idAtom } from '@/state/brain-model-config';
import circuitAtom from '@/state/circuit';

export function useWorkflowConfig(workflowName: string): WorkflowFilesType {
  const configId = useAtomValue(idAtom);
  const circuitInfo = useAtomValue(circuitAtom);
  const stepsToBuild = useAtomValue(cellCompositionStepsToBuildAtom);

  let replacedConfigFiles: WorkflowFilesType = [];
  switch (workflowName) {
    case WORKFLOW_SIMULATION_TASK_NAME:
      replacedConfigFiles = getSimulationTaskFiles(SIMULATION_FILES, circuitInfo);
      break;

    case WORKFLOW_CIRCUIT_BUILD_TASK_NAME:
      if (stepsToBuild.includes(EXECUTION_GROUPS.CELL_COMPOSITION)) {
        replacedConfigFiles = getCircuitBuildingTaskFiles(CIRCUIT_BUILDING_FILES, configId);
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
