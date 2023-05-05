'use client';

import { Session } from 'next-auth';

import {
  WORKFLOW_CIRCUIT_BUILD_TASK_NAME,
  WORKFLOW_SIMULATION_TASK_NAME,
  WORKFLOW_VIDEO_GENERATION_TASK_NAME,
  CIRCUIT_BUILDING_FILES,
  SIMULATION_FILES,
  VIDEO_GENERATION_FILES,
  WorkflowFile,
} from '@/services/bbp-workflow/config';
import {
  getCircuitBuildingTaskFiles,
  getSimulationTaskFiles,
  getVideoGenerationTaskFiles,
} from '@/services/bbp-workflow';
import { GROUPS as EXECUTION_GROUPS, CellCompositionStepGroupValues } from '@/state/build-status';
import { BrainModelConfigResource, DetailedCircuitResource } from '@/types/nexus';

function getCircuitUrl(config: BrainModelConfigResource | null): string {
  if (!config?._self) return '';
  return `${config?._self}?rev=${config?._rev}`;
}

async function generateWorkflowConfig(
  workflowName: string,
  circuitInfo: DetailedCircuitResource | null,
  stepsToBuild: CellCompositionStepGroupValues[],
  config: BrainModelConfigResource,
  session: Session,
  extraVariablesToReplace: Record<string, any>
): Promise<WorkflowFile[]> {
  let replacedConfigFiles: WorkflowFile[] = [];

  const configUrl = getCircuitUrl(config);

  switch (workflowName) {
    case WORKFLOW_SIMULATION_TASK_NAME: {
      replacedConfigFiles = await getSimulationTaskFiles(
        SIMULATION_FILES,
        circuitInfo,
        extraVariablesToReplace,
        session
      );
      break;
    }

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

export default generateWorkflowConfig;
