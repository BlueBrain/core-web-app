import pickBy from 'lodash/pickBy';
import { nexus } from '@/config';
import { Distribution, FileMetadata } from '@/types/nexus';
import { metadataKeys, revParamRegexp } from '@/constants/nexus';

export function collapseId(nexusId: string): string {
  if (!nexusId) return nexusId;

  // TODO: remove this once we create new Release configs with proper id
  if (nexusId.startsWith(nexus.legacyIdBaseUrl)) {
    return nexusId;
  }
  return nexusId.replace(`${nexus.defaultIdBaseUrl}/`, '') ?? '';
}

export function expandId(collapsedId: string) {
  return collapsedId.match(/\//) || !collapsedId
    ? collapsedId
    : `${nexus.defaultIdBaseUrl}/${collapsedId}`;
}

type ApiGroupType = 'resource' | 'file' | 'view';

export type ComposeUrlParams = {
  schema?: string | null;
  rev?: number;
  source?: boolean;
  org?: string;
  project?: string;
  viewType?: 'es' | 'sparql';
  sync?: boolean;
  idExpand?: boolean;
  tag?: string;
};

const ViewTypeMap = {
  es: '_search',
  sparql: 'sparql',
};

/**
  Assembles Nexus API URL
*/
export function composeUrl(apiGroupType: ApiGroupType, id: string, params?: ComposeUrlParams) {
  const {
    rev,
    schema = '_',
    source = false,
    org = nexus.org,
    project = nexus.project,
    viewType,
    sync = false,
    idExpand = true,
    tag = undefined,
  } = params ?? {};

  // if id has revision and revision is passed as attribute remove to avoid collision
  const revRemoved = rev && id.includes('?rev=') ? id.replace(revParamRegexp, '') : id;
  const uriEncodedId = encodeURIComponent(idExpand ? expandId(revRemoved) : revRemoved);

  const pathname = [
    `${apiGroupType}s`,
    org,
    project,
    apiGroupType === 'resource' ? schema : null,
    uriEncodedId,
    source ? 'source' : null,
    viewType ? ViewTypeMap[viewType] : null,
  ]
    .filter(Boolean)
    .join('/');

  const searchParams = new URLSearchParams();

  if (rev) {
    searchParams.set('rev', rev.toString());
  }
  if (tag) {
    searchParams.set('tag', tag);
  }

  if (sync) {
    searchParams.set('indexing', 'sync');
  }

  const searchParamsStr = searchParams.toString();

  return [nexus.url, '/', pathname, searchParamsStr ? `?${searchParamsStr}` : null]
    .filter(Boolean)
    .join('');
}

export function createDistribution(
  payloadMetadata: FileMetadata,
  contentUrl?: string
): Distribution {
  if (!payloadMetadata._rev)
    throw new Error('revision in file metadata missing when creating distribution');

  return {
    '@type': 'DataDownload',
    name: payloadMetadata._filename,
    contentSize: {
      unitCode: 'bytes',
      value: payloadMetadata._bytes,
    },
    contentUrl:
      contentUrl ?? composeUrl('file', payloadMetadata['@id'], { rev: payloadMetadata._rev }),
    encodingFormat: payloadMetadata._mediaType,
    digest: {
      algorithm: payloadMetadata._digest._algorithm,
      value: payloadMetadata._digest._value,
    },
  };
}

export function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value].filter((v) => v !== undefined);
}

export function removeMetadata(resource: Record<string, any>) {
  return pickBy(resource, (value, key) => !metadataKeys.includes(key));
}

export function getMetadata(resource: Record<string, any>) {
  return pickBy(resource, (value, key) => metadataKeys.includes(key));
}

export function setRev(url: string, rev: number | string) {
  const urlObj = new URL(url);

  urlObj.searchParams.set('rev', rev.toString());

  return urlObj.toString();
}

export function getUUIDFromId(id: string | null) {
  if (!id) return null;
  if (!id.includes('/')) return id;

  return id.split('/').at(-1) as string;
}

export function getIdFromSelfUrl(selfUrl: string | null) {
  if (!selfUrl) return null;
  const encodedId = selfUrl.split('/').at(-1);
  const decodedId = decodeURIComponent(encodedId || '');
  return decodedId;
}

export function getOrgFromSelfUrl(selfUrl: string | null) {
  if (!selfUrl) return null;
  return selfUrl.replace(`${nexus.url}/resources/`, '').split('/')[0];
}

export function getProjectFromSelfUrl(selfUrl: string | null) {
  if (!selfUrl) return null;
  return selfUrl.replace(`${nexus.url}/resources/`, '').split('/')[1];
}
