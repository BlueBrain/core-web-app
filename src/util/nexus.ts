import { nexus } from '@/config';
import {
  Distribution,
  FileMetadata,
  GeneratorConfig,
  GeneratorConfigType,
  GeneratorName,
} from '@/types/nexus';
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

export type ComposeUrlParams = {
  schema?: string | null;
  rev?: number;
  source?: boolean;
  org?: string;
  project?: string;
  viewType?: 'es' | 'sparql';
  sync?: boolean;
  idExpand?: boolean;
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
  } = params ?? {};

  const uriEncodedId = encodeURIComponent(idExpand ? expandId(id) : id);

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

export type IdType =
  | 'file'
  | 'modelconfiguration'
  | 'cellcompositionconfig'
  | 'cellpositionconfig'
  | 'emodelassignmentconfig'
  | 'morphologyassignmentconfig'
  | 'microconnectomeconfig'
  | 'synapseconfig'
  | 'macroconnectomeconfig'
  | 'wholebrainconnectomestrength';

export function createId(type: IdType, id?: string) {
  const typePath = type === 'file' ? '' : `/${type}s`;

  return `https://bbp.epfl.ch/neurosciencegraph/data${typePath}/${id ?? crypto.randomUUID()}`;
}

const generatorNameByKgType: Record<GeneratorConfigType, GeneratorName> = {
  CellCompositionConfig: 'cell_composition',
  CellPositionConfig: 'cell_position',
  EModelAssignmentConfig: 'placeholder',
  MorphologyAssignmentConfig: 'placeholder',
  MicroConnectomeConfig: 'connectome',
  SynapseConfig: 'connectome_filtering',
  MacroConnectomeConfig: 'connectome',
};

export function createDistribution(payloadMetadata: FileMetadata): Distribution {
  return {
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
  };
}

interface CreateGeneratorConfigProps {
  id?: string;
  name?: string;
  description?: string;
  kgType: GeneratorConfigType;
  payloadMetadata: FileMetadata;
}

export function createGeneratorConfig({
  id,
  name = 'Generator configuration',
  description = 'NA',
  kgType,
  payloadMetadata,
}: CreateGeneratorConfigProps): PartialBy<GeneratorConfig, '@id'> {
  return {
    '@context': 'https://bbp.neuroshapes.org',
    '@type': [kgType, 'Entity'],
    '@id': id,
    name,
    description,
    generatorName: generatorNameByKgType[kgType],
    distribution: createDistribution(payloadMetadata),
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

export function ensureArray<T>(value: T | T[]) {
  return Array.isArray(value) ? value : [value];
}
