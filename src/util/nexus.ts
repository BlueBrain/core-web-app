import { v4 as uuidv4 } from 'uuid';

import { nexus } from '@/config';
import { CellCompositionConfig, CellPositionConfig, FileMetadata } from '@/types/nexus';
import { PartialBy } from '@/types/common';

export function collapseId(nexusId: string) {
  return nexusId?.replace(`${nexus.defaultIdBaseUrl}/`, '') ?? '';
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

type IdType = 'file' | 'modelconfiguration' | 'cellcompositionconfig' | 'cellpositionconfig';

export function createId(type: IdType, id?: string) {
  const typePath = type === 'file' ? '' : `/${type}s`;

  return `https://bbp.epfl.ch/neurosciencegraph/data${typePath}/${id ?? uuidv4()}`;
}

interface CreateCellCompositionConfigProps {
  id?: string;
  name?: string;
  description?: string;
  payloadMetadata: FileMetadata;
}
export function createCellCompositionConfig({
  id,
  name = 'Cell composition generator configuration',
  description = 'NA',
  payloadMetadata,
}: CreateCellCompositionConfigProps): PartialBy<CellCompositionConfig, '@id'> {
  return {
    '@context': 'https://bbp.neuroshapes.org',
    '@type': ['CellCompositionConfig', 'Entity'],
    '@id': id,
    name,
    description,
    generatorName: 'cell_composition',
    distribution: {
      '@type': 'DataDownload',
      name: payloadMetadata._filename,
      contentSize: {
        unitCode: 'bytes',
        value: payloadMetadata._bytes,
      },
      contentUrl: composeUrl('file', payloadMetadata['@id'], { rev: payloadMetadata._rev }),
      encodingFormat: payloadMetadata._mediaType,
      digest: {
        algorithm: payloadMetadata._digest._algorithm,
        value: payloadMetadata._digest._value,
      },
    },
  };
}

interface CreateCellPositionConfigProps {
  id?: string;
  name?: string;
  payloadMetadata: FileMetadata;
}
export function createCellPositionConfig({
  id,
  name = 'Cell position generator configuration',
  payloadMetadata,
}: CreateCellPositionConfigProps): PartialBy<CellPositionConfig, '@id'> {
  return {
    '@context': 'https://bbp.neuroshapes.org',
    '@type': ['CellPositionConfig', 'Entity'],
    '@id': id,
    name,
    generatorName: 'me_type_property',
    description: '',

    distribution: {
      '@type': 'DataDownload',
      name: payloadMetadata._filename,
      encodingFormat: payloadMetadata._mediaType,
      contentSize: {
        unitCode: 'bytes',
        value: payloadMetadata._bytes,
      },
      contentUrl: composeUrl('file', payloadMetadata['@id'], { rev: payloadMetadata._rev }),
      digest: {
        algorithm: payloadMetadata._digest._algorithm,
        value: payloadMetadata._digest._value,
      },
    },
  };
}

/**
 * Create a URL with customized rev search parameter
 */
export function setRevision<T extends string | undefined>(url?: T, rev?: number | null) {
  if (!url) return url as T extends string ? string : undefined;

  const urlObj = new URL(url);

  if (rev) {
    urlObj.searchParams.set('rev', rev.toString());
  } else {
    urlObj.searchParams.delete('rev');
  }

  return urlObj.toString() as T extends string ? string : undefined;
}
