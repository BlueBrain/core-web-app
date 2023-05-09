import { Session } from 'next-auth';
import template from 'lodash/template';

import {
  convertExpDesConfigToSimVariables,
  cloneWorkflowMetaConfigs,
  customRangeDelimeter,
} from './simulationHelper';
import {
  BBP_WORKFLOW_AUTH_URL,
  BBP_WORKFLOW_TASK_PATH,
  WORKFLOW_TEST_TASK_NAME,
  WorkflowFile,
  PLACEHOLDERS,
  SimulationPlaceholders,
} from '@/services/bbp-workflow/config';
import {
  UNICORE_JOB_CONFIG,
  UNICORE_FILES,
  PLACEHOLDERS as UNICORE_PLACEHOLDERS,
} from '@/services/unicore/config';
import { submitJob, waitUntilJobDone } from '@/services/unicore/helper';
import { DetailedCircuitResource } from '@/types/nexus';
import { getVariantTaskConfigUrlFromCircuit } from '@/api/nexus';

export function getWorkflowAuthUrl(username: string) {
  return BBP_WORKFLOW_AUTH_URL.replace(PLACEHOLDERS.USERNAME, username);
}

function replacePlaceholdersInFile(
  filesList: WorkflowFile[],
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

  // workaround to remove the string on the placeholders to be SONATA compatible
  const templateReplaceRegexp = new RegExp(`"${customRangeDelimeter}(.+?)"`, 'gm');

  extraVariables = {
    ...(await cloneWorkflowMetaConfigs(extraVariables, templateReplaceRegexp, session)),
  };

  const replacedFiles = structuredClone(workflowFiles).map((file) => {
    const modifiedFile = file;
    modifiedFile.CONTENT = template(modifiedFile.CONTENT)(extraVariables);
    modifiedFile.CONTENT = modifiedFile.CONTENT.replace(templateReplaceRegexp, '$1');
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
