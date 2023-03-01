import {
  UnicoreJobDefinition,
  GeneralJobDefinition,
  JobProperties,
  DataToUpload,
  UnicoreStatuses,
} from '@/services/unicore/types';
import { UNICORE_BASE } from '@/services/unicore/config';
import { createHeaders } from '@/util/utils';

const jobStatus: Record<string, UnicoreStatuses> = {
  SUCCESSFUL: 'SUCCESSFUL',
  ERROR: 'ERROR',
  FAILED: 'FAILED',
};

/* eslint-disable no-underscore-dangle */

function actionJob(actionURL: string, token: string) {
  // initiate some actions like start, restart, abort
  return fetch(actionURL, {
    method: 'post',
    headers: createHeaders(token),
    body: JSON.stringify({}),
  });
}

function getInfoByUrl(transferUrl: string, token: string): Promise<JobProperties> {
  return fetch(transferUrl, {
    headers: createHeaders(token, {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }),
  })
    .then((r) => r.json())
    .catch((e: Error) => {
      throw new Error(`getInfoByUrl ${e.message}`);
    });
}

function createJob(url: string, jobDefinition: UnicoreJobDefinition, token: string): Promise<any> {
  return fetch(`${url}/jobs`, {
    method: 'post',
    body: JSON.stringify(jobDefinition),
    headers: createHeaders(token, {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }),
  });
}

function uploadData(dataToUpload: DataToUpload, uploadURL: string, token: string): Promise<any> {
  const data = dataToUpload.Data;
  const target = dataToUpload.To;
  return fetch(`${uploadURL}/${target}`, {
    method: 'put',
    headers: createHeaders(token, {
      Accept: 'application/octet-stream',
      'Content-Type': 'application/octet-stream',
    }),
    body: data,
  });
}

async function getJobProperties(jobURL: string, token: string): Promise<JobProperties | null> {
  let jobInfo = null;
  try {
    jobInfo = await getInfoByUrl(jobURL, token);
  } catch (e) {
    throw new Error(`[getJobProperties] ${e}`);
  }

  if (!jobInfo) return null;
  const id = jobInfo._links.self.href.split('/').pop();
  if (!id) return null;
  jobInfo.id = id;
  return jobInfo;
}

export async function waitUntilJobDone(jobURL: string, token: string): Promise<true | null> {
  const jobInfo = await getJobProperties(jobURL, token);
  if (!jobInfo) return null;

  if (jobStatus.SUCCESSFUL === jobInfo.status) return true;
  /* eslint-disable-next-line no-promise-executor-return */
  await new Promise((r) => setTimeout(r, 3000));
  const isOk = waitUntilJobDone(jobURL, token);
  return isOk;
}

async function generateUnicoreConfig(
  configParams: GeneralJobDefinition
): Promise<UnicoreJobDefinition> {
  const unicoreConfig: UnicoreJobDefinition = {
    Name: configParams.title || 'unnamed job',
    Executable: configParams.executable,
    Arguments: [],
    Environment: configParams.environment,
    haveClientStageIn: 'true',
    Resources: {
      Nodes: configParams.nodes,
      CPUsPerNode: configParams.cpusPerNode,
      Memory: configParams.memory,
      Runtime: configParams.runtime,
      NodeConstraints: configParams.nodeType,
      Project: configParams.project,
    },
    Partition: configParams.partition,
    Tags: configParams.tags,
    Imports: configParams.imports,
  };
  return unicoreConfig;
}

export async function submitJob(
  runConfig: GeneralJobDefinition,
  inputs: Array<DataToUpload>,
  token: string,
  startLater: boolean = false
): Promise<JobProperties> {
  const newRunConfig = runConfig;

  try {
    const launchParams = await generateUnicoreConfig(newRunConfig);
    const job = await createJob(UNICORE_BASE, launchParams, token);

    const jobURL = job.headers.get('location');
    if (!jobURL) throw new Error('Location not present on response headers');

    const jobProperties = await getJobProperties(jobURL, token);
    if (!jobProperties) throw new Error('getJobProperties');

    const workingDirectory = jobProperties._links.workingDirectory.href;
    const actionStartURL = jobProperties._links['action:start'].href;

    // upload all the inputs
    await Promise.all(
      inputs.map((input: DataToUpload) => uploadData(input, `${workingDirectory}/files`, token))
    );

    // avoid starting the job directly
    if (startLater) {
      return jobProperties;
    }

    await actionJob(actionStartURL, token);
    return jobProperties;
  } catch (err) {
    throw new Error(`[Submit job] ${err}`);
  }
}

export default submitJob;
