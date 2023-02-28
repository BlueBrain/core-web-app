/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { logError } from '@/util/logger';
import { assertType, isString } from '@/util/type-guards';

export interface UnicoreserviceOptions {
  token: string;
  url: string;
}

export interface JobOptions {
  // "proj3", "proj85", ...
  account: string;
}

export interface JobStatus {
  hostname: string;
  status: 'RUNNING' | 'WAITING' | 'ERROR';
  /**
   * Estimated time of arrival.
   * When we think the allocation will be available (in seconds from now).
   */
  eta: number;
}

const BACKEND_PATH = '/gpfs/bbp.cscs.ch/home/petitjea/circuit-studio-backend';

export default class UnicoreService {
  constructor(private readonly options: UnicoreserviceOptions) {}

  /**
   * @returns Job ID.
   */
  async createJob({ account }: JobOptions): Promise<string> {
    const response = await this.post('jobs', {
      Name: 'BCS-Backend',
      Executable: `echo $(hostname -f):5000 > hostname && ${BACKEND_PATH}/start-secure.sh 5000 > stdout.txt 2> stderr.txt`,
      Project: account,
      Partition: 'prod',
      Resources: {
        Nodes: 1,
        Runtime: '2h',
        Memory: 0,
        Exclusive: 'true',
        /**
         * This is for the certificate files:
         * - $TMPDIR/$HOSTNAME.crt
         * - $TMPDIR/$HOSTNAME.key
         */
        Comment: 'certs',
      },
    });
    if (response.status !== 201) {
      logError('Unable to create UNICORE Job!', response);
      throw Error(`Error #${response.status}: ${response.statusText}`);
    }
    const jobURL = response.headers.get('Location');
    if (!jobURL) {
      throw Error('Unable to creat UNICORE Job: location response header is missing!');
    }
    const pos = jobURL.lastIndexOf('/jobs/');
    const jobId = jobURL.substring(pos + '/jobs/'.length);
    return jobId;
  }

  async getJobStatus(jobId: string): Promise<JobStatus> {
    const response = await this.get(joinPath('jobs', jobId, 'details'));
    const jobStatus: JobStatus = {
      hostname: '?',
      status: 'WAITING',
      eta: 0,
    };
    let previousJobDetails = '';
    try {
      const data: unknown = await response.json();
      const currentJobDetails = JSON.stringify(data);
      if (previousJobDetails !== currentJobDetails) {
        previousJobDetails = currentJobDetails;
      }
      assertJobDetails(data);
      return parseJobDetails(data);
    } catch (ex) {
      logError(ex);
      jobStatus.status = 'ERROR';
    }
    return jobStatus;
  }

  /**
   * @returns Content of a text file, or `null` if the file does not exist.
   */
  async loadTextFile(jobId: string, filename: string): Promise<string | null> {
    const response = await this.get(
      joinPath('storages', `${jobId}-uspace`, 'files', filename),
      {},
      'application/octet-stream'
    );
    if (response.ok) return response.text();

    if (response.status === 404) {
      // The file does not exist.
      return null;
    }
    logError('Unable to load file:', filename);
    await response.text();
    throw Error(`Unable to read content of file "${filename}"!`);
  }

  private async post(path: string, data: unknown): Promise<Response> {
    const { url, token } = this.options;
    return fetch(joinPath(url, path), {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      redirect: 'follow',
      referrer: 'no-referrer',
      body: JSON.stringify(data),
    });
  }

  private async get(
    path: string,
    params: Record<string, string> = {},
    contentType = 'application/json'
  ): Promise<Response> {
    const { url, token } = this.options;
    const search = new URLSearchParams();
    for (const name of Object.keys(params)) {
      const value = params[name];
      search.set(name, value);
    }
    const options: RequestInit = {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        Accept: contentType,
        Authorization: `Bearer ${token}`,
      },
      redirect: 'follow',
      referrer: 'no-referrer',
    };
    return fetch(`${joinPath(url, path)}${search.toString()}`, options);
  }
}

function assertJobDetails(data: unknown): asserts data is Record<string, string> {
  assertType(data, ['map', 'string'], 'JobDetails');
}

function parseJobDetails(data: Record<string, string>): JobStatus {
  const { rawDetailsData } = data;
  if (isString(rawDetailsData)) return parseJobDetailsOldVersion(rawDetailsData);

  const jobStatus: JobStatus = {
    hostname: '',
    status: 'WAITING',
    eta: 0,
  };
  switch (data.JobState) {
    case 'RUNNING':
      jobStatus.status = 'RUNNING';
      break;
    case 'ERROR':
      jobStatus.status = 'ERROR';
      break;
    default:
      jobStatus.status = 'WAITING';
  }
  if (data.NodeList) jobStatus.hostname = data.NodeList;
  if (data.LastSchedEval) {
    jobStatus.eta = Math.ceil(Date.parse(data.LastSchedEval) - Date.now());
  }

  return jobStatus;
}

function parseJobDetailsOldVersion(rawDetailsData: string): JobStatus {
  const jobStatus: JobStatus = {
    hostname: '',
    status: 'WAITING',
    eta: 0,
  };
  const items: Record<string, string> = {};
  for (const rawLine of rawDetailsData.split('\n')) {
    const line = rawLine.trim();
    const pos = line.indexOf('=');
    if (pos < 0) continue;

    const name = line.substring(0, pos).trim();
    const value = line.substring(pos + 1).trim();
    switch (name) {
      case 'BatchHost':
        jobStatus.hostname = value;
        break;
      case 'JobState':
        switch (value.split(' ')[0] ?? 'WAITING') {
          case 'RUNNING':
            jobStatus.status = 'RUNNING';
            break;
          case 'ERROR':
            jobStatus.status = 'ERROR';
            break;
          default:
            jobStatus.status = 'WAITING';
        }
        break;
      default:
      // Just ignore this parameter.
    }
    items[name] = value;
  }
  return jobStatus;
}

function joinPath(...pathes: string[]): string {
  const end = pathes.length - 1;
  return pathes
    .map((path, index) => {
      let newPath = path;
      if (index > 0 && path.charAt(0) === '/') newPath = path.substring(1);
      if (index < end && path.endsWith('/')) newPath = path.substring(0, path.length - 1);
      return newPath;
    })
    .join('/');
}
