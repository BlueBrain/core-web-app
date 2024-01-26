/* eslint-disable no-console */

import Settings from '../../common/settings';
import Async from '../../common/utils/async';
import State from '../../common/state';
import { JsonRpcServiceAddress } from '../../common/json-rpc/types';
import { getSessionStorage } from '../../common/state/storage';
import { BackendAllocationOptions, JobAllocatorServiceInterface, JobStatus } from './types';
import ProxyService from './proxy-service';
import { logError } from '@/util/logger';

const JOBID_STORAGE_KEY = 'BackendAllocatorService/JobId';
export default class BackendAllocatorService {
  private readonly jobAllocationService: JobAllocatorServiceInterface;

  constructor(token: string) {
    this.jobAllocationService = new ProxyService({
      token,
      url: Settings.PROXY_MASTER_URL,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  get jobId() {
    return getSessionStorage().getItem(JOBID_STORAGE_KEY) ?? '';
  }

  // eslint-disable-next-line class-methods-use-this
  set jobId(value: string) {
    getSessionStorage().setItem(JOBID_STORAGE_KEY, value);
  }

  /**
   * There are three different use cases here, depending on the URL params.
   * 1. There is a valid "host" URL param:
   *    we connect to this backend.
   * 2. There is a valid "unicore" URL param:
   *    we use the value of this param as the account to allocate
   *    a node on BB5 through UNICORE.
   *    This will give us the backend address that we put into "host"
   *    URL param and we reload the page.
   * 3. None of these URL params have been set:
   *    we ask the user for an account or an address and we set
   *    the URL param accordingly before reloading the page.
   * @returns The backend address for use case 1. Otherwise `null`,
   * which means that we have to wait for a page reload.
   */
  async allocate(): Promise<JsonRpcServiceAddress | null> {
    this.jobId = '';
    const opts: BackendAllocationOptions = {
      account: Settings.UNICORE_ACCOUNT,
      partition: Settings.UNICORE_PARTITION,
      memory: Settings.UNICORE_MEMORY,
      onProgress(message) {
        State.progress.allocation.value = message;
      },
    };

    try {
      opts.onProgress('Contacting node allocation service...');
      this.jobId = await this.jobAllocationService.createJob();
      opts.onProgress('Waiting for an available node...');
      await Async.sleep(2000);
      let status: JobStatus = {
        hostname: '?',
        status: 'WAITING',
        startTime: null,
      };
      let lastDisplayedStatus = '';
      do {
        await Async.sleep(1000);
        status = await this.jobAllocationService.getJobStatus(this.jobId);
        if (status.status !== lastDisplayedStatus) {
          lastDisplayedStatus = status.status;
          const { startTime } = status;
          if (startTime) {
            const seconds = (startTime.getTime() - Date.now()) / 1000;
            if (seconds < 60) {
              opts.onProgress(`Available in ${seconds} seconds...`);
            } else if (seconds < 3600) {
              opts.onProgress(`Available in ${Math.ceil(seconds / 60)} minutes...`);
            } else {
              opts.onProgress(`Available in ${Math.ceil(seconds / 3600)} hours...`);
            }
          }
        }
      } while (status.status === 'WAITING');
      if (status.status === 'ERROR') throw Error('Unable to allocate a node!');

      opts.onProgress(`Connecting to ${status.hostname}.`);
      return {
        backendHost: sanitizeHostname(status.hostname, 'backend'),
        rendererHost: sanitizeHostname(status.hostname, 'renderer'),
      };
    } catch (ex) {
      logError('Error during UNICORE step:', ex);
      this.logStandardOutputAndError();
      return null;
    }
  }

  readonly logStandardOutputAndError = async (tailing = true) => {
    const { jobId } = this;
    console.log('Loading stdout and stderr from UNICORE...');
    const stdout = await this.loadStdout(jobId);
    console.info('StdOut %s\n%c%s', jobId, cssBackground('#7f7'), tailing ? tail(stdout) : stdout);
    const stderr = await this.loadStderr(jobId);
    console.info('StdErr %s\n%c%s', jobId, cssBackground('#f77'), tailing ? tail(stderr) : stderr);
  };

  private async loadStdout(jobId: string): Promise<string> {
    try {
      return (await this.jobAllocationService.loadTextFile(jobId, 'stdout')) ?? '';
    } catch (ex) {
      return '<Empty StdOut>';
    }
  }

  private async loadStderr(jobId: string): Promise<string> {
    try {
      return (await this.jobAllocationService.loadTextFile(jobId, 'stderr')) ?? '';
    } catch (ex) {
      return '<Empty StdErr>';
    }
  }
}

function cssBackground(color: string) {
  return `display:block;font-family:monospace;background:${color};color:#000;font-size:70%;white-space:pre-wrap`;
}

/**
 * @returns Only the last 25 lines of `text`.
 */
function tail(text: string, limit = 25): string {
  let count = limit;
  for (let i = text.length - 1; i >= 0; i -= 1) {
    if (text.charAt(i) === '\n') {
      count -= 1;
      if (count < 1) return `...\n${text.substring(i + 1)}`;
    }
  }
  return text;
}

function sanitizeHostname(host: string, target: 'backend' | 'renderer'): string {
  const PREFIXES_TO_REMOVE = ['https://', 'http://'];
  const prefixedHostName = host.replace('[SERVER]', target);
  for (const prefixToRemove of PREFIXES_TO_REMOVE) {
    if (prefixedHostName.startsWith(prefixToRemove)) {
      return prefixedHostName.substring(prefixToRemove.length);
    }
  }
  return prefixedHostName;
}
