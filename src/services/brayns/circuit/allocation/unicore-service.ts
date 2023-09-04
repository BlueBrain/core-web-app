/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import Settings from '../../common/settings';
import { NODE_STARTUP_SCRIPT } from './startup-scripts';
import { JobAllocatorServiceInterface, JobStatus } from './types';
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

export default class UnicoreService implements JobAllocatorServiceInterface {
  constructor(private readonly options: UnicoreserviceOptions) {}

  /**
   * @returns Job ID.
   */
  async createJob(): Promise<string> {
    const response = await this.post('jobs', {
      Name: 'BCS-Backend',
      Executable: NODE_STARTUP_SCRIPT,
      Project: Settings.UNICORE_ACCOUNT,
      Partition: 'prod',
      Resources: {
        Nodes: 1,
        Runtime: '2h',
        Memory: 0,
        Exclusive: 'true',
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
      startTime: null,
    };
    let previousJobDetails = '';
    try {
      const data: unknown = await response.json();
      const currentJobDetails = JSON.stringify(data);
      if (previousJobDetails !== currentJobDetails) {
        previousJobDetails = currentJobDetails;
        // Show the current job details for diagnostics.
        // eslint-disable-next-line no-console
        console.log(JSON.stringify(data, null, '    '));
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

const REGEX_NODE_NAME = /[a-z0-9]+/;

function parseJobDetails(data: Record<string, string>): JobStatus {
  const { rawDetailsData } = data;
  if (isString(rawDetailsData)) return parseJobDetailsOldVersion(rawDetailsData);

  const jobStatus: JobStatus = {
    hostname: '',
    status: 'WAITING',
    startTime: null,
  };
  if (data.StartTime) {
    // Try to get the estimate time of allocation.
    const eta = new Date(data.StartTime);
    if (!Number.isNaN(eta.valueOf())) jobStatus.startTime = eta;
  }
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
  if (data.NodeList) {
    let hostname: string = data.NodeList;
    if (REGEX_NODE_NAME.test(hostname)) {
      hostname = `${hostname}.bbp.epfl.ch`;
    }
    jobStatus.hostname = hostname;
  }

  return jobStatus;
}

function parseJobDetailsOldVersion(rawDetailsData: string): JobStatus {
  const jobStatus: JobStatus = {
    hostname: '',
    status: 'WAITING',
    startTime: null,
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
          // Just waiting for the next valid status.
        }
        break;
      default:
      // Just waiting for the next valid status.
    }
    items[name] = value;
  }
  return jobStatus;
}

export function joinPath(...paths: string[]): string {
  const end = paths.length - 1;
  return paths
    .map((originalPath, index) => {
      let path = originalPath;
      if (index > 0 && path.charAt(0) === '/') path = path.substring(1);
      if (index < end && path.endsWith('/')) path = path.substring(0, path.length - 1);
      return path;
    })
    .join('/');
}
