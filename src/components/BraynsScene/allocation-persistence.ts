/**
 * About 2 hours.
 * If it remains less than 1 minute before the allocation
 * is over, then we allocate another one.
 */
const EXPIRATION = (7200 - 60) * 1000;

const STORAGE_ITEM = 'Brayns/Unicore';

interface Persistence {
  host: string;
  expiration: number;
}

const DEFAULT_PERSISTENCE: Persistence = {
  host: '',
  expiration: 0,
};

function storageGet(): Persistence {
  const text = window.sessionStorage.getItem(STORAGE_ITEM);
  if (!text) return DEFAULT_PERSISTENCE;

  try {
    const data = JSON.parse(text);
    if (Array.isArray(data) || typeof data !== 'object') throw Error('Expected an object!');

    const { host, expiration } = data;
    if (typeof host !== 'string') throw Error(`"host" was expected to be a string!`);
    if (typeof expiration !== 'number') throw Error(`"expiration" was expected to be a number!`);
    return { host, expiration };
  } catch (ex) {
    console.error(`Invalid syntax for Session item "${STORAGE_ITEM}": `, text);
    console.error(ex);
    return DEFAULT_PERSISTENCE;
  }
}

function storageSet(persistence: Persistence) {
  window.sessionStorage.setItem(STORAGE_ITEM, JSON.stringify(persistence));
}

const PersistenceInstance = {
  /**
   * We store the host from an Unicore allocation to be
   * able to reuse it later if it's not expired.
   */
  setAllocatedHost(host: string) {
    const now = Date.now();
    const persistence = storageGet();
    if (persistence.host === host && persistence.expiration < now) return;

    storageSet({
      host,
      expiration: now + EXPIRATION,
    });
  },
  /**
   * @returns Currently allocated host, or null if expired.
   */
  getAllocatedHost(): string | null {
    const now = Date.now();
    const persistence = storageGet();
    if (now < persistence.expiration) return persistence.host;

    return null;
  },
  clearAllocatedHost() {
    window.sessionStorage.removeItem(STORAGE_ITEM);
  },
};

export default PersistenceInstance;
