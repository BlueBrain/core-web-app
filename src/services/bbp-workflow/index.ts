import {
  BBP_WORKFLOW_PING_TASK,
  BBP_WORKFLOW_AUTH_URL,
  BBP_WORKFLOW_TASK_PATH,
  WORKFLOW_TEST_TASK_NAME,
  WorkflowFilesType,
  PLACEHOLDERS,
  WORKFLOW_VIDEO_GENERATION_TASK_NAME,
  VIDEO_GENERATION_FILES,
  WORKFLOW_SIMULATION_TASK_NAME,
  WORKFLOW_CIRCUIT_BUILD_TASK_NAME,
} from '@/services/bbp-workflow/config';
import { getSimulationCampaignConfiguration } from '@/services/bbp-workflow/nexus';
import { LoginAtomInterface } from '@/state/login';
import type { Circuit } from '@/types/nexus';

async function runChecksBeforeLaunching(headers: HeadersInit, username: string) {
  // check the pod is active
  const podResponse = await fetch(BBP_WORKFLOW_PING_TASK.replace(PLACEHOLDERS.USERNAME, username), {
    method: 'OPTIONS',
    headers,
  });
  if (!podResponse.ok) {
    throw new Error('Pod is not available. Please run "bbp-workflow version" on your terminal');
  }

  // set offline token if not there
  const authResponse = await fetch(BBP_WORKFLOW_AUTH_URL.replace(PLACEHOLDERS.USERNAME, username), {
    method: 'GET',
    headers,
  });
  if (!authResponse.ok) {
    throw new Error('Auth exchange failed. Please run "bbp-workflow version" on your terminal');
  }
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

function getSimulationTaskFiles(
  workflowFiles: WorkflowFilesType,
  circuit: Circuit
): WorkflowFilesType {
  return replacePlaceholdersInFile(
    workflowFiles,
    'simulation.cfg',
    PLACEHOLDERS.CIRCUIT_URL,
    // eslint-disable-next-line no-underscore-dangle
    circuit._self
  );
}

function getCircuitBuildingTaskFiles(workflowFiles: WorkflowFilesType): WorkflowFilesType {
  return workflowFiles;
}

function getVideoGenerationTaskFiles(simulationConfigUrl: string): WorkflowFilesType {
  return replacePlaceholdersInFile(
    VIDEO_GENERATION_FILES,
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
  let workflowResponse;
  try {
    workflowResponse = await fetch(url, {
      method: 'POST',
      body: data,
      headers,
    });
    if (workflowResponse.status === 404) {
      return null;
    }
  } catch {
    return null;
  }

  const nexusUrl = await workflowResponse.text();

  // eslint-disable-next-line no-promise-executor-return
  await new Promise((r) => setTimeout(r, 3000));

  return nexusUrl;
}

export async function launchWorkflowTask(
  loginInfo: LoginAtomInterface,
  workflowName: string = WORKFLOW_TEST_TASK_NAME,
  workflowFiles: WorkflowFilesType = [],
  circuitInfo?: Circuit | null
): Promise<string> {
  const url = getWorkflowTaskUrl(loginInfo.username, workflowName);

  const headers = new Headers({
    Authorization: `Bearer ${loginInfo.accessToken}`,
  });

  await runChecksBeforeLaunching(headers, loginInfo.username);

  let replacedConfigFiles = workflowFiles;

  if (workflowName === WORKFLOW_SIMULATION_TASK_NAME) {
    if (!circuitInfo) throw new Error('Circuit information is not available');
    replacedConfigFiles = getSimulationTaskFiles(workflowFiles, circuitInfo);
  }
  if (workflowName === WORKFLOW_CIRCUIT_BUILD_TASK_NAME) {
    replacedConfigFiles = getCircuitBuildingTaskFiles(workflowFiles);
  }

  const data = generateFormData(replacedConfigFiles);
  const nexusUrl = await launchWorkflow(url, headers, data);
  if (!nexusUrl) throw new Error('Error launching workflow');

  // workaround to connect the simulation and the video generation
  if (workflowName === WORKFLOW_SIMULATION_TASK_NAME) {
    const simulationConfigUrl = await getSimulationCampaignConfiguration(
      loginInfo.accessToken,
      nexusUrl
    );
    replacedConfigFiles = getVideoGenerationTaskFiles(simulationConfigUrl);
    const videoUrl = getWorkflowTaskUrl(loginInfo.username, WORKFLOW_VIDEO_GENERATION_TASK_NAME);
    const videoData = generateFormData(replacedConfigFiles);
    await launchWorkflow(videoUrl, headers, videoData);
  }

  return nexusUrl;
}

export default launchWorkflowTask;
