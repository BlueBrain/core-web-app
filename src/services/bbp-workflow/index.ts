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
} from '@/services/bbp-workflow/config';
import { getSimulationCampaignConfiguration } from '@/services/bbp-workflow/nexus';
import { LoginAtomInterface } from '@/state/login';

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

export async function launchWorkflowTask(
  loginInfo: LoginAtomInterface,
  workflowName: string = WORKFLOW_TEST_TASK_NAME,
  workflowFiles: WorkflowFilesType = []
): Promise<boolean | string> {
  const url = BBP_WORKFLOW_TASK_PATH.replace(PLACEHOLDERS.USERNAME, loginInfo.username).replace(
    PLACEHOLDERS.TASK_NAME,
    workflowName
  );

  const data = new FormData();

  Object.values(workflowFiles).forEach((file) => {
    if (file.TYPE === 'file') {
      data.append(file.NAME, new Blob([file.CONTENT]), file.NAME);
    } else {
      data.append(file.NAME, file.CONTENT);
    }
  });

  const headers = new Headers({
    Authorization: `Bearer ${loginInfo.accessToken}`,
  });

  await runChecksBeforeLaunching(headers, loginInfo.username);

  let workflowResponse;
  try {
    workflowResponse = await fetch(url, {
      method: 'POST',
      body: data,
      headers,
    });
    if (workflowResponse.status === 404) {
      return false;
    }
  } catch {
    return false;
  }

  const nexusUrl = await workflowResponse.text();

  // eslint-disable-next-line no-promise-executor-return
  await new Promise((r) => setTimeout(r, 3000));

  // workaround to connect the simulation and the video generation
  if (workflowName === WORKFLOW_SIMULATION_TASK_NAME) {
    const newConfigFiles = [...VIDEO_GENERATION_FILES];
    const simulationConfigUrl = await getSimulationCampaignConfiguration(
      loginInfo.accessToken,
      nexusUrl
    );
    newConfigFiles[0].CONTENT = newConfigFiles[0].CONTENT.replace(
      PLACEHOLDERS.SIMULATION_URL,
      simulationConfigUrl
    );
    await launchWorkflowTask(loginInfo, WORKFLOW_VIDEO_GENERATION_TASK_NAME, newConfigFiles);
  }
  return nexusUrl;
}

export default launchWorkflowTask;
