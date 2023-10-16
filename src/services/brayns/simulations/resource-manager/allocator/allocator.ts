/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { checkSlotId } from '../../utils';
import Settings from '../../../common/settings';
import ProxyService from './proxy-service';
import AllocatorStorage from './storage';
import { Allocation } from './types';

export default class Allocator {
  private allocationProcess: Promise<Allocation> | null = null;

  private readonly storage: AllocatorStorage;

  private currentToken = '';

  constructor(private readonly slotId: number) {
    checkSlotId(slotId);
    this.storage = new AllocatorStorage(slotId);
  }

  allocate(token: string): Promise<Allocation> {
    if (!this.allocationProcess || token !== this.currentToken) {
      this.currentToken = token;
      this.allocationProcess = this.createAllocationProcess(token);
    }

    return this.allocationProcess;
  }

  reset() {
    this.storage.clear();
  }

  private async createAllocationProcess(token: string): Promise<Allocation> {
    try {
      // We first check for an ongoing allocation.
      const ongoingAllocation = this.storage.get();
      if (ongoingAllocation && ongoingAllocation.endTime > Date.now()) return ongoingAllocation;

      const proxy = new ProxyService({
        token,
        url: Settings.PROXY_MASTER_URL,
      });
      const jobId = await proxy.createJob();
      // Timeout in 60 seconds.
      const timetout = Date.now() + 60 * 1000;
      while (Date.now() < timetout) {
        const status = await proxy.getJobStatus(jobId);
        if (status.status === 'ERROR') {
          throw Error(`Unable to allocate a node on slot #${this.slotId}!`);
        }
        if (status.status === 'RUNNING') {
          const allocation = {
            host: sanitizeHostname(status.hostname, 'renderer'),
            endTime: status.endTime,
          };
          this.storage.set(allocation);
          return allocation;
        }
      }
      throw Error(`Timeout for node allocation on slot #${this.slotId}!`);
    } catch (ex) {
      // An error occured during the allocation process.
      // We need to clean up the session storage to prevent
      // the next attemps to try to reuse this broken allocation.
      this.storage.clear();
      throw ex;
    }
  }
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
