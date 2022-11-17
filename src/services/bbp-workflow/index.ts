import {
  BBP_WORKFLOW_TASK_PATH,
  WORKFLOW_TEST_TASK_NAME,
  WorkflowFilesType,
} from '@/services/bbp-workflow/config';
import { LoginAtomInterface } from '@/atoms/login';

export async function launchWorkflowTask(
  loginInfo: LoginAtomInterface,
  workflowName: string = WORKFLOW_TEST_TASK_NAME,
  workflowFiles: WorkflowFilesType = []
): Promise<boolean> {
  const url = BBP_WORKFLOW_TASK_PATH.replace('{USERNAME}', loginInfo.username).replace(
    '{TASK_NAME}',
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

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: data,
      headers,
    });
    if (response.status === 404) {
      // The pod is not available
      // Launch Unicore to initialize the pod
      return false;
    }
  } catch {
    return false;
  }

  // eslint-disable-next-line no-promise-executor-return
  await new Promise((r) => setTimeout(r, 5 * 1000));
  return true;
}

export default launchWorkflowTask;
