/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-await-in-loop */
import Settings from '../settings';
import Async from '../utils/async';
import State from '../state';
import { JsonRpcServiceAddress } from '../json-rpc/types';
import { BackendAllocationOptions } from './types';
import UnicoreService, { JobStatus } from './unicore-service';
import { logError } from '@/util/logger';

const JOBID_STORAGE_KEY = 'BackendAllocatorService/JobId';
export default class BackendAllocatorService {
  private readonly unicoreService: UnicoreService;

  constructor(token: string) {
    this.unicoreService = new UnicoreService({
      token,
      url: Settings.UNICORE_URL,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  get jobId() {
    return window.sessionStorage.getItem(JOBID_STORAGE_KEY) ?? '';
  }

  // eslint-disable-next-line class-methods-use-this
  set jobId(value: string) {
    window.sessionStorage.setItem(JOBID_STORAGE_KEY, value);
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
      opts.onProgress('Contacting UNICORE...');
      this.jobId = await this.unicoreService.createJob({
        account: opts.account,
      });
      opts.onProgress('Waiting for an available node on BB5...');
      let status: JobStatus = {
        hostname: '?',
        status: 'WAITING',
        startTime: null,
      };
      let lastDisplayedStatus = '';
      do {
        await Async.sleep(300);
        status = await this.unicoreService.getJobStatus(this.jobId);
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
      if (status.status === 'ERROR') throw Error('Unable to allocate a node on BB5!');

      opts.onProgress('Brayns services are starting...');
      const backendIsStarted = await this.waitForBraynsServicesToBeUpAndRunning();
      if (!backendIsStarted) return null;

      opts.onProgress(`Connected to ${status.hostname}.`);
      return {
        host: status.hostname,
        backendPort: Settings.BRAYNS_BACKEND_PORT,
        rendererPort: Settings.BRAYNS_RENDERER_PORT,
      };
    } catch (ex) {
      logError('Error during UNICORE step:', ex);
      this.logStandardOutputAndError();
      return null;
    }
  }

  /**
   * @returns `true` if the backend and Brayns have started successfuly.
   */
  private async waitForBraynsServicesToBeUpAndRunning(): Promise<boolean> {
    const { jobId } = this;
    let stdout = '';
    let stderr = '';
    let backendIsStarted = false;
    let braynsIsStarted = false;
    let loop = 60;
    while (loop > 0) {
      loop -= 1;
      await sleep(1000);
      stdout = await this.loadStdout(jobId);
      if (!braynsIsStarted && includesLine(stdout, 'Brayns service started.')) {
        braynsIsStarted = true;
        console.log('Brayns Renderer has started!');
      }
      stderr = await this.loadStderr(jobId);
      if (!backendIsStarted && includesLine(stderr, 'BCS Server is listening')) {
        backendIsStarted = true;
        console.log('Brayns Backend has started!');
      }
      if (braynsIsStarted && backendIsStarted) {
        return true;
      }
    }
    // If the connection is not established after 60 seconds,
    // we display the content of stdout and stderr for diagnostic.
    this.logStandardOutputAndError();
    return false;
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
      return (await this.unicoreService.loadTextFile(jobId, 'stdout')) ?? '';
    } catch (ex) {
      return '<Empty StdOut>';
    }
  }

  private async loadStderr(jobId: string): Promise<string> {
    try {
      return (await this.unicoreService.loadTextFile(jobId, 'stderr')) ?? '';
    } catch (ex) {
      return '<Empty StdErr>';
    }
  }
}

async function sleep(timeout: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, timeout);
  });
}

function includesLine(content: string, stringToFind: string): boolean {
  return content.split('\n').filter((line) => line.includes(stringToFind)).length > 0;
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
