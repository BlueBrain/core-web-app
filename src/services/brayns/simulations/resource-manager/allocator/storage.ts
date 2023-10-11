import { ALLOCATION_LIFETIME } from './settings';
import { Allocation } from './types';
import { assertType } from '@/util/type-guards';

export default class AllocatorStorage {
  private readonly key: string;

  constructor(private readonly slotId: number) {
    this.key = `brayns/simulation/allocation/${slotId}`;
  }

  set(allocation: Allocation) {
    if (allocation.endTime < Date.now()) {
      // The allocator service was not able to return a end of time.
      // We will assume we have the time we wanted.
      // eslint-disable-next-line no-param-reassign
      allocation.endTime = Date.now() + ALLOCATION_LIFETIME;
    }
    const item = JSON.stringify(allocation);
    window.localStorage.setItem(this.key, item);
  }

  get(): Allocation | null {
    const item = window.localStorage.getItem(this.key);
    if (!item) return null;

    try {
      const data = JSON.parse(item);
      assertType<Allocation>(data, {
        host: 'string',
        endTime: 'number',
      });
      return Date.now() < data.endTime ? data : null;
    } catch (ex) {
      // The item in the storage has an invalid format.
      // This is only possible if a user tempered the session storage.
      // In this case, we consider that there is no ongioing allocation.
      return null;
    }
  }

  clear() {
    window.localStorage.removeItem(this.key);
  }
}
