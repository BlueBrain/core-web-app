/* eslint-disable @typescript-eslint/no-use-before-define */
import State from '../state';
import { LimitedStringCacheMap } from './cache-map';
import { logError } from '@/util/logger';
import { assertType } from '@/util/type-guards';

export interface NexusMetadata {
  '@id': string;
  '@type': string;
  _location: string;
  _storage: {
    '@type': string;
  };
}

/**
 * LRU cache with a size limit of 100 Mb.
 */
const meshesCache = new LimitedStringCacheMap(100e6);

export async function loadMeshFromNexus(url: string, token: string): Promise<string> {
  State.progress.loadingMeshes.value += 1;
  try {
    const mesh = await meshesCache.get(url, async () => {
      const response = await fetch(url, {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok)
        throw Error(`HTTP error code is ${response.status} (${response.statusText})!`);

      const content = await response.text();
      return content;
    });
    return mesh;
  } catch (ex) {
    logError('Unable to fetch mesh from:', url);
    logError(ex);
    throw ex;
  } finally {
    State.progress.loadingMeshes.value -= 1;
  }
}

export async function loadNexusMetadata(url: string, token: string): Promise<NexusMetadata | null> {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/ld+json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok)
      throw Error(`HTTP error code is ${response.status} (${response.statusText})!`);

    const metadata = await response.json();
    assertNexusMetadata(metadata);
    return metadata;
  } catch (ex) {
    logError(`Unable to load data from "${url}":`, ex);
    return null;
  }
}

function assertNexusMetadata(data: unknown): asserts data is NexusMetadata {
  assertType(
    data,
    {
      '@id': 'string',
      '@type': 'string',
      _location: 'string',
      _storage: {
        '@type': 'string',
      },
    },
    'NexusMetadata'
  );
}
