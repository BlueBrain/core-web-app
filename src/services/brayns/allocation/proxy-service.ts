/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import Settings from '../settings';
import { JobAllocatorServiceInterface, JobStatus } from './types';
import { logError } from '@/util/logger';
import { assertType } from '@/util/type-guards';

const HTTP_CREATED_CODE = 201;

export interface ProxyServiceOptions {
  token: string;
  url: string;
}

export interface JobOptions {
  // "SBO1", ...
  usecase: string;
}

export default class ProxyService implements JobAllocatorServiceInterface {
  constructor(private readonly options: ProxyServiceOptions) {}

  /**
   * @returns Job ID.
   */
  async createJob(): Promise<string> {
    const response = await this.post({ usecase: 'SBO1' });
    if (response.status !== HTTP_CREATED_CODE) {
      logError('Unable to create Allocation Job!', response);
      throw Error(`Error #${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    assertStartResponse(data);
    return data.job_id;
  }

  async getJobStatus(jobId: string): Promise<JobStatus> {
    const response = await this.get(jobId);
    const jobStatus: JobStatus = {
      hostname: '?',
      status: 'WAITING',
      startTime: null,
    };
    try {
      const data: unknown = await response.json();
      assertStatusResponse(data);
      return this.parseJobDetails(data, jobId);
    } catch (ex) {
      logError(ex);
      jobStatus.status = 'ERROR';
    }
    return jobStatus;
  }

  /**
   * @returns Content of a text file, or `null` if the file does not exist.
   */
  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  async loadTextFile(jobId: string, filename: string): Promise<string | null> {
    return `Reading content of "${jobId}" is not implemented yet!`;
  }

  private async post(data: unknown): Promise<Response> {
    const { url, token } = this.options;
    return fetch(joinPath(url, 'start'), {
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

  private async get(jobId: string, contentType = 'application/json'): Promise<Response> {
    const { url, token } = this.options;
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
    return fetch(`${joinPath(url, `status/${jobId}`)}`, options);
  }

  private parseJobDetails(data: StatusResponse, jobId: string): JobStatus {
    if (!data.job_running || !data.brayns_started)
      return {
        hostname: '',
        status: 'WAITING',
        startTime: null,
      };

    const endTime = new Date(data.end_time ?? Date.now());
    return {
      hostname: `${Settings.PROXY_SLAVE_URL}${jobId}/[SERVER]?token=${this.options.token}`,
      status: 'RUNNING',
      startTime: endTime,
    };
  }
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

interface StartResponse {
  job_id: string;
}

function assertStartResponse(data: unknown): asserts data is StartResponse {
  try {
    assertType<StartResponse>(data, {
      job_id: 'string',
    });
  } catch (ex) {
    if (ex instanceof Error) {
      logError(ex.message, data);
    }
    throw ex;
  }
}

interface StatusResponse {
  job_running: boolean;
  end_time?: string;
  brayns_started: boolean;
}

function assertStatusResponse(data: unknown): asserts data is StatusResponse {
  try {
    assertType<StartResponse>(data, {
      job_running: 'boolean',
      end_time: ['|', 'string', 'null'],
      brayns_started: 'boolean',
    });
  } catch (ex) {
    if (ex instanceof Error) {
      logError(ex.message, data);
    }
    throw ex;
  }
}
