import JsonRpcService from '../json-rpc/json-rpc';
import { logError } from '@/util/logger';
import { assertString } from '@/util/type-guards';

/**
 * We need to store (session) persistent data on the service
 * because we may lose data between two browsers refreshes.
 */
export default class Storage {
  constructor(private readonly service: JsonRpcService) {}

  async get(key: string): Promise<unknown> {
    try {
      const data = await this.service.exec('storage-session-get', { key });
      assertString(data, `storage["${key}"]`);
      if (data.length === 0) return '';

      const value = JSON.parse(data);
      return value;
    } catch (ex) {
      logError(`Unable to get storage key "${key}":`, ex);
      return null;
    }
  }

  async set(key: string, value: unknown): Promise<void> {
    await this.service.exec('storage-session-set', { key, value: JSON.stringify(value) });
  }
}
