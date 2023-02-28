/* eslint-disable @typescript-eslint/no-use-before-define */
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
