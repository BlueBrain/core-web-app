'use client';

import { Session } from 'next-auth';

import {
  WORKFLOW_CIRCUIT_BUILD_TASK_NAME,
  WORKFLOW_SIMULATION_TASK_NAME,
  CIRCUIT_BUILDING_FILES,
  SIMULATION_FILES,
  WorkflowFile,
} from '@/services/bbp-workflow/config';
import { getCircuitBuildingTaskFiles, getSimulationTaskFiles } from '@/services/bbp-workflow';
import { BrainModelConfigResource, DetailedCircuitResource, SubConfigName } from '@/types/nexus';
import { composeUrl } from '@/util/nexus';

function getCircuitUrl(config: BrainModelConfigResource): string {
  return composeUrl('resource', config['@id'], { rev: config._rev });
}

async function generateWorkflowConfig(
  workflowName: string,
  circuitInfo: DetailedCircuitResource | null,
  targetConfigToBuild: SubConfigName | null,
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
      if (!targetConfigToBuild) break;
      replacedConfigFiles = getCircuitBuildingTaskFiles(
        CIRCUIT_BUILDING_FILES,
        configUrl,
        targetConfigToBuild
      );
      break;

    default:
      replacedConfigFiles = [];
      break;
  }

  return replacedConfigFiles;
}

export default generateWorkflowConfig;
