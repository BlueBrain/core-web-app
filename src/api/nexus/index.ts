import { Session } from 'next-auth';
import { captureException } from '@sentry/nextjs';

import { nexus } from '@/config';
import {
  composeUrl,
  ComposeUrlParams,
  createId,
  expandId,
  createGeneratorConfig,
  createDistribution,
} from '@/util/nexus';
import {
  BrainModelConfig,
  BrainModelConfigResource,
  CellCompositionConfig,
  CellPositionConfig,
  Entity,
  EntityResource,
  FileMetadata,
  GeneratorTaskActivityResource,
  BbpWorkflowConfigResource,
  DetailedCircuitResource,
  VariantTaskActivityResource,
  VariantTaskConfigResource,
  EModelAssignmentConfig,
  MorphologyAssignmentConfig,
  MicroConnectomeConfig,
  SynapseConfig,
  MacroConnectomeConfig,
  MacroConnectomeConfigPayload,
  WholeBrainConnectomeStrength,
} from '@/types/nexus';
import {
  getBrainModelConfigsByNameQuery,
  getEntitiesByIdsQuery,
  getGeneratorTaskActivityQuery,
  getPersonalBrainModelConfigsQuery,
  getPublicBrainModelConfigsQuery,
  getVariantTaskActivityByCircuitIdQuery,
} from '@/queries/es';
import { createHeaders } from '@/util/utils';

// #################################### Generic methods ##########################################

export function fetchJsonFileById<T>(id: string, session: Session) {
  const url = composeUrl('file', id);

  return fetch(url, {
    headers: createHeaders(session.accessToken),
  }).then<T>((res) => res.json());
}

export function fetchFileByUrl(url: string, session: Session): Promise<Response> {
  return fetch(url, {
    headers: createHeaders(session.accessToken),
  });
}

export function fetchJsonFileByUrl<T>(url: string, session: Session) {
  return fetchFileByUrl(url, session).then<T>((res) => res.json());
}

export function fetchTextFileByUrl(url: string, session: Session): Promise<string> {
  return fetchFileByUrl(url, session).then((res) => res.text());
}

export function fetchFileMetadataById(id: string, session: Session) {
  const url = composeUrl('file', id);

  return fetch(url, {
    headers: createHeaders(session.accessToken, { Accept: 'application/ld+json' }),
  }).then<FileMetadata>((res) => res.json());
}

export function fetchFileMetadataByUrl(url: string, session: Session) {
  return fetch(url, {
    headers: createHeaders(session.accessToken, { Accept: 'application/ld+json' }),
  }).then<FileMetadata>((res) => res.json());
}

export function createFile(
  data: any,
  filename: string,
  contentType: string,
  session: Session
): Promise<FileMetadata> {
  const url = composeUrl('file', '');

  const formData = new FormData();
  const dataBlob = new Blob([data], { type: contentType });
  formData.append('file', dataBlob, filename);

  return fetch(url, {
    method: 'POST',
    headers: createHeaders(session.accessToken, null),
    body: formData,
  }).then<FileMetadata>((res) => res.json());
}

export function createJsonFile(rawData: any, filename: string, session: Session) {
  const data = JSON.stringify(rawData);
  const contentType = 'application/json';
  return createFile(data, filename, contentType, session);
}

export function createTextFile(data: any, filename: string, session: Session) {
  const contentType = 'text/plain';
  return createFile(data, filename, contentType, session);
}

export function updateFileByUrl(
  url: string,
  data: any,
  filename: string,
  contentType: string,
  session: Session
) {
  const formData = new FormData();
  const dataBlob = new Blob([data], { type: contentType });
  formData.append('file', dataBlob, filename);

  return fetch(url, {
    method: 'PUT',
    headers: createHeaders(session.accessToken, null),
    body: formData,
  }).then<FileMetadata>((res) => res.json());
}

export function updateFileById(
  id: string,
  data: any,
  filename: string,
  contentType: string,
  rev: number,
  session: Session
) {
  const url = composeUrl('file', id, { rev });

  return updateFileByUrl(url, data, filename, contentType, session);
}

export function updateJsonFileById(
  id: string,
  rawData: any,
  filename: string,
  rev: number,
  session: Session
) {
  const data = JSON.stringify(rawData);
  return updateFileById(id, data, filename, 'application/json', rev, session);
}

export function updateJsonFileByUrl(url: string, data: any, filename: string, session: Session) {
  return updateFileByUrl(url, JSON.stringify(data), filename, 'application/json', session);
}

export function fetchResourceById<T>(id: string, session: Session, options?: ComposeUrlParams) {
  const url = composeUrl('resource', id, options);

  return fetch(url, {
    headers: createHeaders(session.accessToken),
  }).then<T>((res) => res.json());
}

export function fetchResourceByUrl<T>(url: string, session: Session) {
  return fetch(url, {
    headers: createHeaders(session.accessToken),
  }).then<T>((res) => res.json());
}

export function fetchResourceSourceById<T>(
  id: string,
  session: Session,
  options?: ComposeUrlParams
) {
  const url = composeUrl('resource', id, { ...options, source: true });

  return fetch(url, {
    headers: createHeaders(session.accessToken),
  }).then<T>((res) => res.json());
}

export function createResource<T extends EntityResource>(
  resource: Record<string, any>,
  session: Session
) {
  const createResourceApiUrl = composeUrl('resource', '', { sync: true, schema: null });

  return fetch(createResourceApiUrl, {
    method: 'POST',
    headers: createHeaders(session.accessToken),
    body: JSON.stringify(resource),
  }).then<T>((res) => res.json());
}

export function updateResource(
  resource: Entity,
  rev: number,
  session: Session
): Promise<EntityResource> {
  const id = resource['@id'];

  const url = composeUrl('resource', id, { rev, sync: true });

  return fetch(url, {
    method: 'PUT',
    headers: createHeaders(session.accessToken),
    body: JSON.stringify(resource),
  }).then((res) => res.json());
}

export function queryES<T>(query: Record<string, any>, session: Session) {
  const apiUrl = composeUrl('view', nexus.defaultESIndexId, { viewType: 'es' });

  return fetch(apiUrl, {
    method: 'POST',
    headers: createHeaders(session.accessToken),
    body: JSON.stringify(query),
  })
    .then((res) => res.json())
    .then<T[]>((res) => res.hits.hits.map((hit: any) => hit._source));
}

// #################################### Non-generic methods ##########################################

export async function cloneCellCompositionConfig(id: string, session: Session) {
  const configSource = await fetchResourceSourceById<CellCompositionConfig>(id, session);
  const payload = await fetchJsonFileByUrl(configSource.distribution.contentUrl, session);

  const clonedPayloadMeta = await createJsonFile(payload, 'cell-composition-config.json', session);

  const clonedConfig: CellCompositionConfig = {
    ...configSource,
    '@id': createId('cellcompositionconfig'),
    distribution: createGeneratorConfig({
      kgType: 'CellCompositionConfig',
      payloadMetadata: clonedPayloadMeta,
    }).distribution,
  };

  return createResource(clonedConfig, session);
}

export async function cloneCellPositionConfig(id: string, session: Session) {
  const configSource = await fetchResourceSourceById<CellPositionConfig>(id, session);
  const payload = await fetchJsonFileByUrl(configSource.distribution.contentUrl, session);

  const clonedPayloadMeta = await createJsonFile(payload, 'cell-position-config.json', session);

  const clonedConfig: CellPositionConfig = {
    ...configSource,
    '@id': createId('cellpositionconfig'),
    distribution: createGeneratorConfig({
      kgType: 'CellPositionConfig',
      payloadMetadata: clonedPayloadMeta,
    }).distribution,
  };

  return createResource(clonedConfig, session);
}

export async function cloneEModelAssignmentConfig(id: string, session: Session) {
  const configSource = await fetchResourceSourceById<EModelAssignmentConfig>(id, session);
  const payload = await fetchJsonFileByUrl(configSource.distribution.contentUrl, session);

  const clonedPayloadMeta = await createJsonFile(payload, 'emodel-assignment-config.json', session);

  const clonedConfig: EModelAssignmentConfig = {
    ...configSource,
    '@id': createId('emodelassignmentconfig'),
    distribution: createGeneratorConfig({
      kgType: 'EModelAssignmentConfig',
      payloadMetadata: clonedPayloadMeta,
    }).distribution,
  };

  return createResource(clonedConfig, session);
}

export async function cloneMorphologyAssignmentConfig(id: string, session: Session) {
  const configSource = await fetchResourceSourceById<MorphologyAssignmentConfig>(id, session);
  const payload = await fetchJsonFileByUrl(configSource.distribution.contentUrl, session);

  const clonedPayloadMeta = await createJsonFile(
    payload,
    'morphology-assignment-config.json',
    session
  );

  const clonedConfig: MorphologyAssignmentConfig = {
    ...configSource,
    '@id': createId('morphologyassignmentconfig'),
    distribution: createGeneratorConfig({
      kgType: 'MorphologyAssignmentConfig',
      payloadMetadata: clonedPayloadMeta,
    }).distribution,
  };

  return createResource(clonedConfig, session);
}

export async function cloneMicroConnectomeConfig(id: string, session: Session) {
  const configSource = await fetchResourceSourceById<MicroConnectomeConfig>(id, session);
  const payload = await fetchJsonFileByUrl(configSource.distribution.contentUrl, session);

  const clonedPayloadMeta = await createJsonFile(payload, 'micro-connectome-config.json', session);

  const clonedConfig: MicroConnectomeConfig = {
    ...configSource,
    '@id': createId('microconnectomeconfig'),
    distribution: createGeneratorConfig({
      kgType: 'MicroConnectomeConfig',
      payloadMetadata: clonedPayloadMeta,
    }).distribution,
  };

  return createResource(clonedConfig, session);
}

export async function cloneSynapseConfig(id: string, session: Session) {
  const configSource = await fetchResourceSourceById<SynapseConfig>(id, session);
  const payload = await fetchJsonFileByUrl(configSource.distribution.contentUrl, session);

  const clonedPayloadMeta = await createJsonFile(payload, 'synapse-config.json', session);

  const clonedConfig: SynapseConfig = {
    ...configSource,
    '@id': createId('synapseconfig'),
    distribution: createGeneratorConfig({
      kgType: 'SynapseConfig',
      payloadMetadata: clonedPayloadMeta,
    }).distribution,
  };

  return createResource(clonedConfig, session);
}

export async function cloneMacroConnectomeConfig(id: string, session: Session) {
  const configSource = await fetchResourceSourceById<MacroConnectomeConfig>(id, session);
  const payload = await fetchJsonFileByUrl<MacroConnectomeConfigPayload>(
    configSource.distribution.contentUrl,
    session
  );

  const overridesEntity = await fetchResourceSourceById<WholeBrainConnectomeStrength>(
    payload.overrides.connection_strength.id,
    session,
    { rev: payload.overrides.connection_strength.rev }
  );
  const overridesPayloadBuffer = await fetchFileByUrl(
    overridesEntity.distribution.contentUrl,
    session
  ).then((res) => res.arrayBuffer());

  const clonedOverridesPayloadMeta = await createFile(
    overridesPayloadBuffer,
    'overrides.arrow',
    'application/arrow',
    session
  );
  const clonedOverridesEntity: WholeBrainConnectomeStrength = {
    ...overridesEntity,
    '@id': createId('wholebrainconnectomestrength'),
    distribution: createDistribution(clonedOverridesPayloadMeta),
  };

  await createResource(clonedOverridesEntity, session);

  payload.overrides.connection_strength.id = clonedOverridesEntity['@id'];
  payload.overrides.connection_strength.rev = 1;

  const clonedPayloadMeta = await createJsonFile(payload, 'macroconnectome-config.json', session);

  const clonedConfig: MacroConnectomeConfig = {
    ...configSource,
    '@id': createId('macroconnectomeconfig'),
    distribution: createDistribution(clonedPayloadMeta),
  };

  return createResource(clonedConfig, session);
}

export async function cloneBrainModelConfig(
  configId: string,
  name: string,
  description: string,
  session: Session
) {
  const brainModelConfigSource = await fetchResourceSourceById<BrainModelConfig>(configId, session);

  const clonedCellCompositionConfigMetadata = await cloneCellCompositionConfig(
    brainModelConfigSource.configs?.cellCompositionConfig['@id'],
    session
  );

  const clonedCellPositionConfigMetadata = await cloneCellPositionConfig(
    brainModelConfigSource.configs.cellPositionConfig['@id'],
    session
  );

  const clonedEModelAssignmentConfigMetadata = await cloneEModelAssignmentConfig(
    brainModelConfigSource.configs.eModelAssignmentConfig['@id'],
    session
  );

  const clonedMorphologyAssignmentConfigMetadata = await cloneMorphologyAssignmentConfig(
    brainModelConfigSource.configs.morphologyAssignmentConfig['@id'],
    session
  );

  const clonedMicroConnectomeConfigMetadata = await cloneMicroConnectomeConfig(
    brainModelConfigSource.configs.microConnectomeConfig['@id'],
    session
  );

  const clonedSynapseConfigMetadata = await cloneSynapseConfig(
    brainModelConfigSource.configs.synapseConfig['@id'],
    session
  );

  const clonedMacroConnectomeConfigMetadata = await cloneMacroConnectomeConfig(
    brainModelConfigSource.configs.macroConnectomeConfig['@id'],
    session
  );

  const clonedModelConfig: BrainModelConfig = {
    ...brainModelConfigSource,
    '@id': createId('modelconfiguration'),
    name,
    description,
    configs: {
      cellCompositionConfig: {
        '@id': clonedCellCompositionConfigMetadata['@id'],
        '@type': ['CellCompositionConfig', 'Entity'],
      },
      cellPositionConfig: {
        '@id': clonedCellPositionConfigMetadata['@id'],
        '@type': ['CellPositionConfig', 'Entity'],
      },
      eModelAssignmentConfig: {
        '@id': clonedEModelAssignmentConfigMetadata['@id'],
        '@type': ['EModelAssignmentConfig', 'Entity'],
      },
      morphologyAssignmentConfig: {
        '@id': clonedMorphologyAssignmentConfigMetadata['@id'],
        '@type': ['MorphologyAssignmentConfig', 'Entity'],
      },
      microConnectomeConfig: {
        '@id': clonedMicroConnectomeConfigMetadata['@id'],
        '@type': ['MicroConnectomeConfig', 'Entity'],
      },
      synapseConfig: {
        '@id': clonedSynapseConfigMetadata['@id'],
        '@type': ['SynapseConfig', 'Entity'],
      },
      macroConnectomeConfig: {
        '@id': clonedMacroConnectomeConfigMetadata['@id'],
        '@type': ['MacroConnectomeConfig', 'Entity'],
      },
    },
  };

  return createResource<BrainModelConfigResource>(clonedModelConfig, session);
}

export async function renameBrainModelConfig(
  config: BrainModelConfigResource,
  name: string,
  description: string,
  session: Session
) {
  const configId = config['@id'];
  const rev = config._rev;

  const brainModelConfigSource = await fetchResourceSourceById<BrainModelConfig>(configId, session);

  const renamedModelConfig = {
    ...brainModelConfigSource,
    name,
    description,
  };

  const clonedModelConfigMetadata = await updateResource(renamedModelConfig, rev, session);

  return clonedModelConfigMetadata;
}

export async function fetchBrainModelConfigsByIds(
  ids: string[],
  session: Session
): Promise<BrainModelConfigResource[]> {
  const expandedIds = ids.map((id) => expandId(id));
  const query = getEntitiesByIdsQuery(expandedIds);

  const configs = await queryES<BrainModelConfigResource>(query, session);
  configs.sort((a, b) => expandedIds.indexOf(a['@id']) - expandedIds.indexOf(b['@id']));

  return configs;
}

export function fetchPublicBrainModels(session: Session): Promise<BrainModelConfigResource[]> {
  const query = getPublicBrainModelConfigsQuery();

  return queryES<BrainModelConfigResource>(query, session);
}

export function fetchPersonalBrainModels(session: Session): Promise<BrainModelConfigResource[]> {
  const query = getPersonalBrainModelConfigsQuery(session.user.username);

  return queryES<BrainModelConfigResource>(query, session);
}

export async function checkNameIfUniq(brainModelConfigName: string, session: Session) {
  const query = {
    ...getBrainModelConfigsByNameQuery(brainModelConfigName),
    fields: ['name'],
    size: 1,
  };

  const sameNameConfigs = await queryES<Pick<BrainModelConfigResource, 'name'>>(query, session);

  return !sameNameConfigs.length;
}

export async function fetchGeneratorTaskActivity(
  configId: string,
  configRev: number,
  session: Session
): Promise<GeneratorTaskActivityResource | null> {
  const query = getGeneratorTaskActivityQuery(configId, configRev);

  const activities = await queryES<GeneratorTaskActivityResource>(query, session);

  if (activities.length > 1) {
    captureException(
      new Error(`Config ${configId}, rev: ${configRev} has multiple generatorTaskActivities`)
    );
  }

  return activities[0] ?? null;
}

export async function createWorkflowConfigResource(
  resourceUrl: string,
  fileContent: string,
  session: Session
) {
  const workflowConfigresource = await fetchJsonFileByUrl<BbpWorkflowConfigResource>(
    resourceUrl,
    session
  );

  const clonedFile = await createTextFile(
    fileContent,
    workflowConfigresource.distribution.name,
    session
  );

  // TODO: make fileds consistent like update, digest, etc
  const bbpWorkflowconfig: BbpWorkflowConfigResource = {
    '@context': workflowConfigresource['@context'],
    '@type': workflowConfigresource['@type'],
    '@id': createId('file'),
    distribution: {
      '@type': 'DataDownload',
      name: clonedFile._filename,
      contentSize: {
        unitCode: 'bytes',
        value: clonedFile._bytes,
      },
      contentUrl: clonedFile._self,
      encodingFormat: clonedFile._mediaType,
      digest: {
        algorithm: clonedFile._digest._algorithm,
        value: clonedFile._digest._value,
      },
    },
  };

  const newResource = await createResource(bbpWorkflowconfig, session);
  return newResource;
}

export async function getVariantTaskConfigUrlFromCircuit(
  circuitResource: DetailedCircuitResource,
  session: Session
) {
  const query = getVariantTaskActivityByCircuitIdQuery(circuitResource['@id']);

  const variantTaskActivities = await queryES<VariantTaskActivityResource>(query, session);
  const variantTaskActivity = variantTaskActivities[0];

  const variantTaskConfig = await fetchResourceById<VariantTaskConfigResource>(
    variantTaskActivity.used['@id'],
    session
  );

  return `${variantTaskConfig._self}?rev=${variantTaskActivity.used_rev}`;
}
