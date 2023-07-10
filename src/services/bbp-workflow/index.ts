import { Session } from 'next-auth';
import template from 'lodash/template';

import { convertExpDesConfigToSimVariables, createWorkflowMetaConfigs } from './simulationHelper';
import {
  BBP_WORKFLOW_AUTH_URL,
  BBP_WORKFLOW_TASK_PATH,
  WORKFLOW_TEST_TASK_NAME,
  WorkflowFile,
  PLACEHOLDERS,
  SimulationPlaceholders,
  BuildingPlaceholders,
} from '@/services/bbp-workflow/config';
import {
  UNICORE_JOB_CONFIG,
  UNICORE_FILES,
  PLACEHOLDERS as UNICORE_PLACEHOLDERS,
} from '@/services/unicore/config';
import { submitJob, waitUntilJobDone } from '@/services/unicore/helper';
import { DetailedCircuitResource } from '@/types/nexus';
import { getVariantTaskConfigUrlFromCircuit } from '@/api/nexus';
import { replaceCustomBbpWorkflowPlaceholders } from '@/components/experiment-designer/utils';
import { getCurrentDate } from '@/util/utils';

export function getWorkflowAuthUrl(username: string) {
  return BBP_WORKFLOW_AUTH_URL.replace(PLACEHOLDERS.USERNAME, username);
}

function generateFormData(replacedConfigFiles: WorkflowFile[]): FormData {
  const data = new FormData();
  Object.values(replacedConfigFiles).forEach((file) => {
    if (file.TYPE === 'file') {
      data.append(file.NAME, new Blob([file.CONTENT]), file.NAME);
    } else {
      data.append(file.NAME, file.CONTENT);
    }
  });
  return data;
}

export async function getSimulationTaskFiles(
  workflowFiles: WorkflowFile[],
  circuitInfo: DetailedCircuitResource | null,
  extraVariablesToReplace: Record<string, any>,
  session: Session
): Promise<WorkflowFile[]> {
  const variantActivityConfigUrl = await getVariantTaskConfigUrlFromCircuit(
    circuitInfo as DetailedCircuitResource,
    session
  );

  let extraVariables = structuredClone(extraVariablesToReplace);

  extraVariables[SimulationPlaceholders.VARIANT_TASK_ACTIVITY] = variantActivityConfigUrl;

  extraVariables = { ...convertExpDesConfigToSimVariables(extraVariables) };

  extraVariables = {
    ...(await createWorkflowMetaConfigs(extraVariables, session)),
  };

  const replacedFiles = structuredClone(workflowFiles).map((file) => {
    const modifiedFile = file;
    modifiedFile.CONTENT = template(modifiedFile.CONTENT)(extraVariables);
    modifiedFile.CONTENT = replaceCustomBbpWorkflowPlaceholders(modifiedFile.CONTENT);
    return modifiedFile;
  });

  return replacedFiles;
}

export function getCircuitBuildingTaskFiles(
  workflowFiles: WorkflowFile[],
  configUrl: string | null
): WorkflowFile[] {
  if (!configUrl) return workflowFiles;

  const escapedConfigUrl = configUrl.includes('%') ? configUrl.replaceAll('%', '%%') : configUrl;

  const circuitBuildingConfigFile = workflowFiles.find((f) => f.NAME === 'circuit_building.cfg');
  if (!circuitBuildingConfigFile) return workflowFiles;

  const variables = {
    [BuildingPlaceholders.CONFIG_URL]: escapedConfigUrl,
    [BuildingPlaceholders.DATE]: getCurrentDate(''),
    [BuildingPlaceholders.UUID]: crypto.randomUUID(),
  };

  circuitBuildingConfigFile.CONTENT = template(circuitBuildingConfigFile.CONTENT)(variables);
  return workflowFiles;
}

function getWorkflowTaskUrl(username: string, workflowName: string): string {
  return BBP_WORKFLOW_TASK_PATH.replace(PLACEHOLDERS.USERNAME, username).replace(
    PLACEHOLDERS.TASK_NAME,
    workflowName
  );
}

async function launchWorkflow(
  url: string,
  headers: Headers,
  data: FormData
): Promise<null | string> {
  const workflowResponse = await fetch(url, {
    method: 'POST',
    body: data,
    headers,
  });
  if (!workflowResponse?.ok) {
    throw new Error(`Error launching workflow (${workflowResponse.status})`);
  }
  const nexusUrl = await workflowResponse.text();
  return nexusUrl;
}

export async function launchUnicoreWorkflowSetup(token: string): Promise<true | null> {
  const tokenFile = UNICORE_FILES.find((f) => f.To === UNICORE_PLACEHOLDERS.TOKEN_TEMP_FILENAME);
  if (!tokenFile) return null;

  tokenFile.Data = tokenFile.Data.replace(UNICORE_PLACEHOLDERS.TOKEN, token);
  const jobInfo = await submitJob(UNICORE_JOB_CONFIG, UNICORE_FILES, token);
  const jobOk = await waitUntilJobDone(jobInfo._links.self.href, token);
  if (!jobOk) {
    throw new Error('[Unicore setup]');
  }
  return true;
}

export type WorkflowRunProps = {
  loginInfo: Session;
  workflowName: string;
  workflowFiles: WorkflowFile[];
};

export async function launchWorkflowTask({
  loginInfo,
  workflowName = WORKFLOW_TEST_TASK_NAME,
  workflowFiles = [],
}: WorkflowRunProps): Promise<string | null> {
  const headers = new Headers({
    Authorization: `Bearer ${loginInfo.accessToken}`,
  });

  const url = getWorkflowTaskUrl(loginInfo.user.username, workflowName);

  const data = generateFormData(workflowFiles);
  const nexusUrl = await launchWorkflow(url, headers, data);

  return nexusUrl;
}

export default launchWorkflowTask;
