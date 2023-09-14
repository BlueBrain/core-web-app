import { JsonRpcServiceInterface } from '../../common/json-rpc/types';
import { logError } from '@/util/logger';
import { assertType } from '@/util/type-guards';

/**
 * We need to store (session) persistent data on the service
 * because we may lose data between two browsers refreshes.
 */
export default class Storage {
  private readonly cache = new Map<string, unknown>();

  private readonly alreadyLoadedOnce = new Set<string>();

  constructor(private readonly service: JsonRpcServiceInterface) {}

  async get(key: string): Promise<unknown> {
    try {
      if (this.alreadyLoadedOnce.has(key)) return this.cache.get(key);

      const data = await this.service.exec('storage-session-get', { key });
      this.alreadyLoadedOnce.add(key);
      assertType<{ value: string | null }>(
        data,
        { value: ['|', 'string', 'null'] },
        `storage["${key}"]`
      );
      if (!data.value) {
        this.cache.set(key, '');
        return '';
      }

      const value = JSON.parse(data.value);
      this.cache.set(key, value);
      return value;
    } catch (ex) {
      logError(`Unable to get storage key "${key}":`, ex);
      this.cache.set(key, null);
      return null;
    }
  }

  async set(key: string, value: unknown): Promise<void> {
    if (this.isSameValue(key, value)) return;

    this.cache.set(key, value);
    this.alreadyLoadedOnce.add(key);
    await this.service.exec('storage-session-set', { key, value: JSON.stringify(value) });
  }

  private isSameValue(key: string, value: unknown): boolean {
    const curValue = JSON.stringify(this.cache.get(key));
    const newValue = JSON.stringify(value);
    return curValue === newValue;
  }
}
