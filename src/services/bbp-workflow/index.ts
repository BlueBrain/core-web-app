import { Session } from 'next-auth';

import {
  BBP_WORKFLOW_AUTH_URL,
  BBP_WORKFLOW_TASK_PATH,
  WORKFLOW_TEST_TASK_NAME,
  WorkflowFilesType,
  PLACEHOLDERS,
} from '@/services/bbp-workflow/config';
import type { DetailedCircuitResource } from '@/types/nexus';
import {
  UNICORE_JOB_CONFIG,
  UNICORE_FILES,
  PLACEHOLDERS as UNICORE_PLACEHOLDERS,
} from '@/services/unicore/config';
import { submitJob, waitUntilJobDone } from '@/services/unicore/helper';

export function getWorkflowAuthUrl(username: string) {
  return BBP_WORKFLOW_AUTH_URL.replace(PLACEHOLDERS.USERNAME, username);
}

function replacePlaceholdersInFile(
  filesList: WorkflowFilesType,
  fileName: string,
  placeholder: string,
  value: string
) {
  const filesCopy = [...filesList];
  const fileToChange = filesCopy.find((file) => file.NAME === fileName);
  if (!fileToChange) return filesCopy;
  fileToChange.CONTENT = fileToChange.CONTENT.replace(placeholder, value);
  return filesCopy;
}

function generateFormData(replacedConfigFiles: WorkflowFilesType): FormData {
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

export function getSimulationTaskFiles(
  workflowFiles: WorkflowFilesType,
  circuit: DetailedCircuitResource | null
): WorkflowFilesType {
  if (!circuit) return workflowFiles;

  return replacePlaceholdersInFile(
    workflowFiles,
    'simulation.cfg',
    PLACEHOLDERS.CIRCUIT_URL,
    // eslint-disable-next-line no-underscore-dangle
    circuit._self
  );
}

export function getCircuitBuildingTaskFiles(
  workflowFiles: WorkflowFilesType,
  configUrl: string | null
): WorkflowFilesType {
  if (!configUrl) return workflowFiles;

  const escapedConfigUrl = configUrl.includes('%') ? configUrl.replaceAll('%', '%%') : configUrl;

  const withConfig = replacePlaceholdersInFile(
    workflowFiles,
    'circuit_building.cfg',
    PLACEHOLDERS.CONFIG_URL,
    escapedConfigUrl
  );
  const withUuid = replacePlaceholdersInFile(
    withConfig,
    'circuit_building.cfg',
    PLACEHOLDERS.UUID,
    crypto.randomUUID()
  );
  return withUuid;
}

export function getVideoGenerationTaskFiles(
  workflowFiles: WorkflowFilesType,
  simulationConfigUrl: string
): WorkflowFilesType {
  return replacePlaceholdersInFile(
    workflowFiles,
    'video_generation.cfg',
    PLACEHOLDERS.SIMULATION_URL,
    simulationConfigUrl
  );
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
  workflowFiles: WorkflowFilesType;
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
