import { nexus } from '@/config';

export function collapseId(nexusId: string) {
  return nexusId.replace(`${nexus.defaultIdBaseUrl}/`, '');
}

export function expandId(collapsedId: string) {
  return collapsedId.match(/\//) || !collapsedId
    ? collapsedId
    : `${nexus.defaultIdBaseUrl}/${collapsedId}`;
}

type ApiGroupType = 'resource' | 'file' | 'view';

type ComposeUrlParams = {
  schema?: string | null;
  rev?: number;
  source?: boolean;
  org?: string;
  project?: string;
  viewType?: 'es' | 'sparql';
  sync?: boolean;
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
  } = params ?? {};

  const uriEncodedId = encodeURIComponent(expandId(id));

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

  if (sync) {
    searchParams.set('indexing', 'sync');
  }

  const seachParamsStr = searchParams.toString();

  return [nexus.url, '/', pathname, seachParamsStr ? `?${seachParamsStr}` : null]
    .filter(Boolean)
    .join('');
}
