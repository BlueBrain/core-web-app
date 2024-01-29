import { JsonRpcServiceAddress } from '@brayns/json-rpc/types';
import { getSessionStorage } from '@brayns/state/storage';
import { logError } from '@/util/logger';
import { assertType } from '@/util/type-guards';

const PersistenceInstance = {
  /**
   * We store the host from an Unicore allocation to be
   * able to reuse it later if it's not expired.
   */
  setAllocatedServiceAddress(address: JsonRpcServiceAddress) {
    const now = Date.now();
    const persistence = storageGet();
    if (persistence.rendererHost === address.rendererHost && persistence.expiration < now) return;

    storageSet({
      ...address,
      expiration: now + EXPIRATION,
    });
  },
  /**
   * @returns Currently allocated host, or null if expired.
   */
  getAllocatedServiceAddress(): JsonRpcServiceAddress | null {
    const now = Date.now();
    const persistence = storageGet();
    if (now < persistence.expiration) return persistence;

    return null;
  },
  clearAllocatedServiceAddress() {
    getSessionStorage().removeItem(STORAGE_ITEM);
  },
};

export default PersistenceInstance;

/**
 * About 2 hours.
 * If it remains less than 1 minute before the allocation
 * is over, then we allocate another one.
 */
const EXPIRATION = (7200 - 60) * 1000;

const STORAGE_ITEM = 'Brayns/Unicore';

interface Persistence extends JsonRpcServiceAddress {
  expiration: number;
}

const DEFAULT_PERSISTENCE: Persistence = {
  backendHost: '',
  rendererHost: '',
  expiration: 0,
};

function isPersistence(data: unknown): data is Persistence {
  if (!data) return false;
  try {
    assertType(data, {
      backendHost: 'string',
      rendererHost: 'string',
      expiration: 'number',
    });
    return true;
  } catch (ex) {
    logError(`Session item "${STORAGE_ITEM}" has been compromised!`, ex);
    logError(data);
    return false;
  }
}

function storageGet(): Persistence {
  const text = getSessionStorage().getItem(STORAGE_ITEM);
  if (!text) return DEFAULT_PERSISTENCE;

  try {
    const data = JSON.parse(text);
    if (!isPersistence(data)) return DEFAULT_PERSISTENCE;

    return data;
  } catch (ex) {
    logError(`Invalid syntax for Session item "${STORAGE_ITEM}": `, text);
    logError(ex);
    return DEFAULT_PERSISTENCE;
  }
}

function storageSet(persistence: Persistence) {
  getSessionStorage().setItem(STORAGE_ITEM, JSON.stringify(persistence));
}
