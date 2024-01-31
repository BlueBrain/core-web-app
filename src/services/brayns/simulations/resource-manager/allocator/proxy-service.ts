import Settings from '../../../common/settings';
import { JobAllocatorServiceInterface, JobStatus, ProxyServiceOptions } from './types';
import { logError } from '@/util/logger';
import { assertType } from '@/util/type-guards';

const HTTP_CREATED_CODE = 201;

const MAX_RETRIES_ON_ERROR = 5;

export default class ProxyService implements JobAllocatorServiceInterface {
  private errorsCount = 0;

  constructor(private readonly options: ProxyServiceOptions) {}

  /**
   * @returns Job ID.
   */
  async createJob(): Promise<string> {
    this.errorsCount = 0;
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
    const jobStatus: JobStatus = {
      hostname: '?',
      status: 'WAITING',
      endTime: 0,
    };
    try {
      const response = await this.get(jobId);
      const text = await response.text();
      const data: unknown = JSON.parse(text);
      assertStatusResponse(data);
      return this.parseJobDetails(data, jobId);
    } catch (ex) {
      this.errorsCount += 1;
      logError(
        `Unable tot get status for job "${jobId}"!\nAttempt ${this.errorsCount} of ${MAX_RETRIES_ON_ERROR}.\n`,
        ex
      );
      jobStatus.status = this.errorsCount < MAX_RETRIES_ON_ERROR ? 'WAITING' : 'ERROR';
    }
    return jobStatus;
  }

  /**
   * @returns Content of a text file, or `null` if the file does not exist.
   */
  async loadTextFile(jobId: string, filename: string): Promise<string | null> {
    return `Reading content of "${jobId}/${filename}" is not implemented in the server yet!`;
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
    const fullUrl = joinPath(url, `status/${jobId}`);
    const response = await fetch(fullUrl, options);
    if (!response.ok) {
      logError('Failing URL:', fullUrl);
      throw Error(
        `Get failed with error #${response.status}: ${
          response.statusText
        }.\n${await response.text()}`
      );
    }
    return response;
  }

  private parseJobDetails(data: StatusResponse, jobId: string): JobStatus {
    if (!data.job_running || !data.brayns_started)
      return {
        hostname: '',
        status: 'WAITING',
        endTime: 0,
      };

    const endTime = new Date(data.end_time ?? Date.now()).valueOf();
    return {
      // hostname: `${Settings.PROXY_SLAVE_URL}${jobId}/[SERVER]?token=${this.options.token}`,
      hostname: `${Settings.PROXY_SLAVE_URL}${jobId}/[SERVER]`,
      status: 'RUNNING',
      endTime,
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
