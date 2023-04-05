/* eslint-disable no-await-in-loop */
import UnicoreService, { JobStatus } from './unicore-service';
import { BackendAllocationOptions } from './types';
import Settings from '@/services/brayns/settings';
import Async from '@/services/brayns/utils/async';
import Events from '@/services/brayns/utils/events';
import { JsonRpcServiceAddress } from '@/services/brayns/json-rpc/types';
import { logError } from '@/util/logger';

export default class BackendAllocatorService {
  private readonly unicoreService: UnicoreService;

  constructor(private readonly token: string) {
    this.unicoreService = new UnicoreService({
      token,
      url: Settings.UNICORE_URL,
    });
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
    const opts: BackendAllocationOptions = {
      account: Settings.UNICORE_ACCOUNT,
      partition: Settings.UNICORE_PARTITION,
      memory: Settings.UNICORE_MEMORY,
      onProgress(message) {
        Events.allocationProgress.dispatch(message);
      },
    };

    try {
      opts.onProgress('Contacting UNICORE...');
      const jobId = await this.unicoreService.createJob({
        account: opts.account,
      });
      opts.onProgress('Waiting for an available node on BB5...');
      let status: JobStatus = {
        hostname: '?',
        status: 'WAITING',
        eta: 0,
      };
      let lastDisplayedStatus = '';
      do {
        await Async.sleep(300);
        status = await this.unicoreService.getJobStatus(jobId);
        if (status.status !== lastDisplayedStatus) {
          lastDisplayedStatus = status.status;
          const { eta } = status;
          if (eta > 1) {
            if (eta < 60) {
              opts.onProgress(`Available in ${eta} seconds...`);
            } else if (eta < 3600) {
              opts.onProgress(`Available in ${Math.ceil(eta / 60)} minutes...`);
            } else {
              opts.onProgress(`Available in ${Math.ceil(eta / 3600)} hours...`);
            }
          }
        }
      } while (status.status === 'WAITING');
      if (status.status === 'ERROR') throw Error('Unable to allocate a node on BB5!');

      opts.onProgress('Backend service is starting...');
      const backendIsStarted = await this.waitForBackendToBeUpAndRunning(jobId);
      if (!backendIsStarted) return null;

      opts.onProgress(`Connected to ${status.hostname}.`);
      return { host: status.hostname, port: Settings.SERVICE_PORT };
    } catch (ex) {
      logError('Error during UNICORE step:', ex);
      return null;
    }
  }

  /**
   * @returns `true` if the backend has started successfuly.
   */
  private async waitForBackendToBeUpAndRunning(jobId: string): Promise<boolean> {
    const MAX_WAITING_TIME_IN_SEC = 30;
    const SLEEP_BETWEEN_ATTEMPTS_IN_SEC = 0.3;
    const timeToLeave = window.performance.now() + MAX_WAITING_TIME_IN_SEC * 1e3;
    let lastStdout = '';
    while (window.performance.now() < timeToLeave) {
      await Async.sleep(SLEEP_BETWEEN_ATTEMPTS_IN_SEC);
      const stdout = await this.unicoreService.loadTextFile(jobId, 'stdout.txt');
      if (stdout) {
        if (lastStdout !== stdout) {
          // eslint-disable-next-line no-console
          console.log(stdout);
          lastStdout = stdout;
        }
        const started = stdout
          .split('\n')
          .filter((line) => line.startsWith('Starting CircuitStudioBackend...'));
        if (started.length > 0) {
          return true;
        }
      }
      const stderr = await this.unicoreService.loadTextFile(jobId, 'stderr.txt');
      if (stderr) {
        logError('Error while waiting for Brayns Backend to be up and running:', stderr, stdout);
        return false;
      }
    }
    return false;
  }
}
