import { Session } from 'next-auth';
import { captureException } from '@sentry/nextjs';

import { nexus } from '@/config';
import {
  composeUrl,
  ComposeUrlParams,
  expandId,
  createDistribution,
  removeMetadata,
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
  SimulationCampaignUIConfigResource,
  SimulationCampaignUIConfig,
  SupportedConfigListTypes,
  MorphologyAssignmentConfigPayload,
  SynapseConfigPayload,
  EntityCreation,
  MicroConnectomeConfigPayload,
  MicroConnectomeVariantSelectionOverrides,
  MicroConnectomeVariantSelectionOverridesResource,
  MicroConnectomeDataOverridesResource,
  MicroConnectomeDataOverrides,
  CellCompositionConfigPayload,
  EModelAssignmentConfigPayload,
  GeneratorConfig,
  GeneratorConfigPayload,
  SubConfigName,
  CellPositionConfigPayload,
} from '@/types/nexus';
import {
  getEntitiesByIdsQuery,
  getGeneratorTaskActivityQuery,
  getPersonalBrainModelConfigsQuery,
  getPublicBrainModelConfigsQuery,
  getVariantTaskActivityByCircuitIdQuery,
} from '@/queries/es';
import { createHeaders } from '@/util/utils';
import { defaultReleaseUrl, supportedUIConfigVersion } from '@/constants/configs';
import { revParamRegexp } from '@/constants/nexus';

// #################################### Generic methods ##########################################

export function fetchJsonFileById<T>(id: string, session: Session) {
  const url = composeUrl('file', id);

  return fetch(url, {
    headers: createHeaders(session.accessToken),
  }).then<T>((res) => res.json());
}

export function fetchFileByUrl(url: string, session: Session): Promise<Response> {
  // TODO refactor when KG id resolution is finalised.
  const urlWithExpandedId = url.split('/').at(-1)?.includes('http')
    ? url
    : url.replace(
        /[a-z|0-9|-]*$/,
        encodeURIComponent(`https://bbp.epfl.ch/neurosciencegraph/data/${url.split('/').at(-1)}`)
      );

  return fetch(urlWithExpandedId, {
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

async function fetchLatestRev(url: string, session: Session) {
  const urlWithoutRev = url.replace(revParamRegexp, '');

  if (url.includes('/files/')) {
    const metadata = await fetchFileMetadataByUrl(urlWithoutRev, session);
    return metadata._rev;
  }

  const resource = await fetchResourceById<EntityResource>(urlWithoutRev, session);
  return resource._rev;
}

export async function updateFileByUrl(
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

export async function updateFileById(
  id: string,
  data: any,
  filename: string,
  contentType: string,
  session: Session,
  rev?: number
) {
  /*
   * when file is passed by id, there is no /files/ in the url so it will try
   * to fetch with fetchResourceById leading to fetch the content instead of the metadata.
   * That is why we need to compose a file url first to pass it to fetchLatestRev
   */
  const latestRev = rev || (await fetchLatestRev(composeUrl('file', id), session));
  const url = composeUrl('file', id, { rev: latestRev });

  return updateFileByUrl(url, data, filename, contentType, session);
}

export function updateJsonFileById(
  id: string,
  rawData: any,
  filename: string,
  session: Session,
  rev?: number
) {
  const data = JSON.stringify(rawData);
  return updateFileById(id, data, filename, 'application/json', session, rev);
}

export async function updateJsonFileByUrl(
  url: string,
  data: any,
  filename: string,
  session: Session
) {
  if (!url.includes('?rev=')) throw new Error('revision not present when updating json file');

  const latestRev = await fetchLatestRev(url, session);
  // positive lookbehind regexp matching what follows the group
  const urlWithLatestRev = url.replace(/(?<=\?rev=)\d+$/, latestRev.toString());

  return updateFileByUrl(
    urlWithLatestRev,
    JSON.stringify(data),
    filename,
    'application/json',
    session
  );
}

export function fetchResourceById<T>(
  id: string,
  session: Session,
  options?: ComposeUrlParams,
  headerExtraOptions?: Record<string, string> | null
) {
  const url = composeUrl('resource', id, options);

  return fetch(url, {
    headers: createHeaders(session.accessToken, headerExtraOptions),
  }).then<T>((res) => res.json());
}

export function fetchResourceByUrl<T>(url: string, session: Session) {
  return fetch(url, {
    headers: createHeaders(session.accessToken),
  }).then<T>((res) => res.json());
}

export function listResourceLinksById<T>(
  id: string,
  session: Session,
  direction: 'incoming' | 'outgoing',
  options?: ComposeUrlParams
) {
  const url = composeUrl('resource', id, { ...options });
  return fetch(`${url}/${direction}`, {
    headers: createHeaders(session.accessToken),
  }).then<T>((res) => res.json());
}

export function createResource<T extends EntityResource>(
  resource: Record<string, any>,
  session: Session
): Promise<T> {
  const createResourceApiUrl = composeUrl('resource', '', { sync: true, schema: null });
  // TODO: remove this while all entities do not have metadata in source
  const sanitizedResource = removeMetadata(resource);

  return fetch(createResourceApiUrl, {
    method: 'POST',
    headers: createHeaders(session.accessToken),
    body: JSON.stringify(sanitizedResource),
  }).then<T>((res) => res.json());
}

export async function updateResource(
  resource: Entity,
  session: Session,
  rev?: number
): Promise<EntityResource> {
  const id = resource['@id'];
  // TODO: remove this while all entities do not have metadata in source
  const sanitizedResource = removeMetadata(resource);
  const latestRev = rev || (await fetchLatestRev(resource['@id'], session));
  const url = composeUrl('resource', id, { rev: latestRev, sync: true });

  return fetch(url, {
    method: 'PUT',
    headers: createHeaders(session.accessToken),
    body: JSON.stringify(sanitizedResource),
  }).then((res) => res.json());
}

export function queryES<T>(
  query: Record<string, any>,
  session: Session,
  params?: ComposeUrlParams
) {
  const apiUrl = composeUrl('view', nexus.defaultESIndexId, { viewType: 'es', ...params });

  return fetch(apiUrl, {
    method: 'POST',
    headers: createHeaders(session.accessToken),
    body: JSON.stringify(query),
  })
    .then((res) => res.json())
    .then<T[]>((res) => res.hits.hits.map((hit: any) => hit._source));
}

async function getPayloadByConfig<
  PayloadType extends GeneratorConfigPayload,
  ConfigType extends GeneratorConfig
>(configName: SubConfigName, configSource: ConfigType, session: Session): Promise<PayloadType> {
  const configVersion = configSource?.configVersion;
  const useRelease = configVersion === undefined;

  if (useRelease) {
    // get payload from fully backend supported Release (Release 23.01)
    const brainModelConfigResource = await fetchResourceByUrl<BrainModelConfig>(
      defaultReleaseUrl,
      session
    );
    const subConfigId = brainModelConfigResource.configs[configName]['@id'];
    const resource = await fetchResourceById<ConfigType>(subConfigId, session);

    return fetchJsonFileByUrl(resource.distribution.contentUrl, session);
  }

  return fetchJsonFileByUrl(configSource.distribution.contentUrl, session);
}

function getConfigVersion(configName: SubConfigName, configSource: GeneratorConfig) {
  const configVersion = configSource?.configVersion;
  const supportedVersion = supportedUIConfigVersion[configName];
  if (configVersion === undefined) return supportedVersion;
  return configVersion;
}

// #################################### Non-generic methods ##########################################

export async function cloneCellCompositionConfig(id: string, session: Session) {
  const configName: SubConfigName = 'cellCompositionConfig';
  const configSource = await fetchResourceById<CellCompositionConfig>(id, session);
  const payload = await getPayloadByConfig<CellCompositionConfigPayload, CellCompositionConfig>(
    configName,
    configSource,
    session
  );
  const clonedPayloadMeta = await createJsonFile(payload, 'cell-composition-config.json', session);

  const clonedConfig: CellCompositionConfig = {
    ...configSource,
    distribution: createDistribution(clonedPayloadMeta),
    configVersion: getConfigVersion(configName, configSource),
    generatorName: 'cell_composition',
  };

  return createResource(clonedConfig, session);
}

export async function cloneCellPositionConfig(id: string, session: Session) {
  const configName: SubConfigName = 'cellPositionConfig';
  const configSource = await fetchResourceById<CellPositionConfig>(id, session);
  const payload = await getPayloadByConfig<CellPositionConfigPayload, CellPositionConfig>(
    configName,
    configSource,
    session
  );

  const clonedPayloadMeta = await createJsonFile(payload, 'cell-position-config.json', session);

  const clonedConfig: CellPositionConfig = {
    ...configSource,
    distribution: createDistribution(clonedPayloadMeta),
    configVersion: getConfigVersion(configName, configSource),
    generatorName: 'cell_position',
  };

  return createResource(clonedConfig, session);
}

export async function cloneEModelAssignmentConfig(id: string, session: Session) {
  const configName: SubConfigName = 'eModelAssignmentConfig';
  const configSource = await fetchResourceById<EModelAssignmentConfig>(id, session);
  const payload = await getPayloadByConfig<EModelAssignmentConfigPayload, EModelAssignmentConfig>(
    configName,
    configSource,
    session
  );

  const clonedPayloadMeta = await createJsonFile(payload, 'emodel-assignment-config.json', session);

  const clonedConfig: EModelAssignmentConfig = {
    ...configSource,
    distribution: createDistribution(clonedPayloadMeta),
    configVersion: getConfigVersion(configName, configSource),
    generatorName: 'placeholder',
  };

  return createResource(clonedConfig, session);
}

export async function cloneMorphologyAssignmentConfig(id: string, session: Session) {
  const configName: SubConfigName = 'morphologyAssignmentConfig';
  const configSource = await fetchResourceById<MorphologyAssignmentConfig>(id, session);
  const payload = await getPayloadByConfig<
    MorphologyAssignmentConfigPayload,
    MorphologyAssignmentConfig
  >(configName, configSource, session);

  const clonedPayloadMeta = await createJsonFile(
    payload,
    'morphology-assignment-config.json',
    session
  );

  const clonedConfig: MorphologyAssignmentConfig = {
    ...configSource,
    distribution: createDistribution(clonedPayloadMeta),
    configVersion: getConfigVersion(configName, configSource),
    generatorName: 'mmodel',
  };

  return createResource(clonedConfig, session);
}

export async function cloneMacroConnectomeConfig(id: string, session: Session) {
  const configName: SubConfigName = 'macroConnectomeConfig';
  const configSource = await fetchResourceById<MacroConnectomeConfig>(id, session);
  const payload = await getPayloadByConfig<MacroConnectomeConfigPayload, MacroConnectomeConfig>(
    configName,
    configSource,
    session
  );

  const overridesEntity = await fetchResourceById<WholeBrainConnectomeStrength>(
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
    distribution: createDistribution(clonedOverridesPayloadMeta),
  };

  await createResource(clonedOverridesEntity, session);

  payload.overrides.connection_strength.id = clonedOverridesEntity['@id'];
  payload.overrides.connection_strength.rev = 1;

  const clonedPayloadMeta = await createJsonFile(payload, 'macroconnectome-config.json', session);

  const clonedConfig: MacroConnectomeConfig = {
    ...configSource,
    distribution: createDistribution(clonedPayloadMeta),
    configVersion: getConfigVersion(configName, configSource),
    generatorName: 'connectome',
  };

  return createResource(clonedConfig, session);
}

export async function cloneMicroConnectomeConfig(id: string, session: Session) {
  const configName: SubConfigName = 'microConnectomeConfig';
  const configSource = await fetchResourceById<MicroConnectomeConfig>(id, session);
  const payload = await getPayloadByConfig<MicroConnectomeConfigPayload, MicroConnectomeConfig>(
    configName,
    configSource,
    session
  );

  if (configSource.configVersion !== supportedUIConfigVersion[configName]) {
    const clonedPayloadMeta = await createJsonFile(payload, 'microconnectome-config.json', session);

    const clonedConfig: MicroConnectomeConfig = {
      ...configSource,
      distribution: createDistribution(clonedPayloadMeta),
      configVersion: getConfigVersion(configName, configSource),
      generatorName: 'connectome',
    };

    return createResource(clonedConfig, session);
  }

  const variantOverridesEntity =
    await fetchResourceById<MicroConnectomeVariantSelectionOverridesResource>(
      payload.overrides.variants.id,
      session,
      { rev: payload.overrides.variants.rev }
    );

  const variantOverridesPayloadBuffer = await fetchFileByUrl(
    variantOverridesEntity.distribution.contentUrl,
    session
  ).then((res) => res.arrayBuffer());

  const clonedVariantOverridesPayloadMeta = await createFile(
    variantOverridesPayloadBuffer,
    'variant-overrides.arrow',
    'application/arrow',
    session
  );

  const clonedVariantOverridesEntity: MicroConnectomeVariantSelectionOverrides = {
    ...variantOverridesEntity,
    distribution: createDistribution(clonedVariantOverridesPayloadMeta),
  };

  const clonedVariantOverridesEntityMeta = await createResource(
    clonedVariantOverridesEntity,
    session
  );

  const variantNames = Object.keys(payload.overrides)
    .filter((key) => key !== 'variants')
    .sort();

  const paramOverridesEntities = await Promise.all(
    variantNames.map((variantName) =>
      fetchResourceById<MicroConnectomeDataOverridesResource>(
        payload.overrides[variantName].id,
        session,
        { rev: payload.overrides[variantName].rev }
      )
    )
  );

  const paramOverridesPayloadBuffers = await Promise.all(
    paramOverridesEntities.map((variantParamOverridesEntity) =>
      fetchFileByUrl(variantParamOverridesEntity.distribution.contentUrl, session).then((res) =>
        res.arrayBuffer()
      )
    )
  );

  const clonedParamOverridesPayloadMetas = await Promise.all(
    variantNames.map((variantName, idx) =>
      createFile(
        paramOverridesPayloadBuffers[idx],
        `${variantName}-param-overrides.arrow`,
        'application/arrow',
        session
      )
    )
  );

  const clonedParamOverridesEntities = await Promise.all(
    variantNames.map((variantName, idx) => {
      const dataOverridesEntity: MicroConnectomeDataOverrides = {
        ...paramOverridesEntities[idx],
        distribution: createDistribution(clonedParamOverridesPayloadMetas[idx]),
      };

      return createResource(dataOverridesEntity, session);
    })
  );

  payload.overrides.variants.id = clonedVariantOverridesEntityMeta['@id'];
  payload.overrides.variants.rev = 1;

  variantNames.forEach((variantName, idx) => {
    payload.overrides[variantName].id = clonedParamOverridesEntities[idx]['@id'];
    payload.overrides[variantName].rev = 1;
  });

  const clonedPayloadMeta = await createJsonFile(payload, 'microconnectome-config.json', session);

  const clonedConfig: MicroConnectomeConfig = {
    ...configSource,
    distribution: createDistribution(clonedPayloadMeta),
    configVersion: getConfigVersion(configName, configSource),
    generatorName: 'connectome',
  };

  return createResource(clonedConfig, session);
}

export async function cloneSynapseConfig(id: string, session: Session) {
  const configName: SubConfigName = 'synapseConfig';
  const configSource = await fetchResourceById<SynapseConfig>(id, session);
  const payload = await getPayloadByConfig<SynapseConfigPayload, SynapseConfig>(
    configName,
    configSource,
    session
  );

  if (configSource.configVersion !== supportedUIConfigVersion[configName]) {
    const payloadMetadata = await createJsonFile(payload, 'synapse-config.json', session);

    const config: SynapseConfig = {
      ...configSource,
      distribution: createDistribution(payloadMetadata),
      configVersion: getConfigVersion(configName, configSource),
      generatorName: 'connectome_filtering',
    };

    return createResource(config, session);
  }

  const synapticAssignmentResource = await fetchResourceById<SynapseConfig>(
    payload.configuration.synapse_properties.id,
    session
  );

  const synapticParametersResource = await fetchResourceById<SynapseConfig>(
    payload.configuration.synapses_classification.id,
    session
  );

  const synapticRulesPayload = await fetchJsonFileByUrl(
    synapticAssignmentResource.distribution.contentUrl,
    session
  );
  const synapticTypesPayload = await fetchJsonFileByUrl(
    synapticParametersResource.distribution.contentUrl,
    session
  );

  const rulesFileMetadata = await createJsonFile(
    synapticRulesPayload,
    'synaptic_assignment.json',
    session
  );
  const typesFileMetadata = await createJsonFile(
    synapticTypesPayload,
    'synaptic_parameters.json',
    session
  );

  const rulesEntity = await createResource(
    {
      '@context': ['https://bbp.neuroshapes.org'],
      '@type': ['Entity', 'Dataset', 'SynapticParameterAssignment'],
      distribution: createDistribution(rulesFileMetadata),
    },
    session
  );

  const typesEntity = await createResource(
    {
      '@context': ['https://bbp.neuroshapes.org'],
      '@type': ['Entity', 'Dataset', 'SynapticParameter'],
      distribution: createDistribution(typesFileMetadata),
    },
    session
  );

  const configPayload = {
    defaults: {
      synapse_properties: {
        id: 'https://bbp.epfl.ch/neurosciencegraph/data/synapticassignment/d57536aa-d576-4b3b-a89b-b7888f24eb21',
        type: ['Dataset', 'SynapticParameterAssignment'],
        rev: 9,
      },
      synapses_classification: {
        id: 'https://bbp.epfl.ch/neurosciencegraph/data/synapticparameters/cf25c2bf-e6e4-4367-acd8-94004bfcfe49',
        type: ['Dataset', 'SynapticParameter'],
        rev: 6,
      },
    },
    configuration: {
      synapse_properties: {
        id: rulesEntity['@id'],
        type: ['Dataset', 'SynapticParameterAssignment'],
        rev: rulesEntity._rev,
      },
      synapses_classification: {
        id: typesEntity['@id'],
        type: ['Dataset', 'SynapticParameter'],
        rev: typesEntity._rev,
      },
    },
  };

  const configMetadata = await createJsonFile(configPayload, 'synapse-config.json', session);

  const config: SynapseConfig = {
    ...configSource,
    distribution: createDistribution(configMetadata),
    configVersion: getConfigVersion(configName, configSource),
    generatorName: 'connectome_filtering',
  };

  return createResource(config, session);
}

export async function cloneBrainModelConfig(
  configId: string,
  name: string,
  description: string,
  session: Session
) {
  const brainModelConfigSource = await fetchResourceById<BrainModelConfig>(configId, session);

  const clonedCellCompositionConfigMetadata = await cloneCellCompositionConfig(
    brainModelConfigSource.configs?.cellCompositionConfig['@id'],
    session
  );

  const clonedCellPositionConfigMetadata = await cloneCellPositionConfig(
    brainModelConfigSource.configs.cellPositionConfig['@id'],
    session
  );

  const clonedMorphologyAssignmentConfigMetadata = await cloneMorphologyAssignmentConfig(
    brainModelConfigSource.configs.morphologyAssignmentConfig['@id'],
    session
  );

  const clonedEModelAssignmentConfigMetadata = await cloneEModelAssignmentConfig(
    brainModelConfigSource.configs.eModelAssignmentConfig['@id'],
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
      morphologyAssignmentConfig: {
        '@id': clonedMorphologyAssignmentConfigMetadata['@id'],
        '@type': ['MorphologyAssignmentConfig', 'Entity'],
      },
      eModelAssignmentConfig: {
        '@id': clonedEModelAssignmentConfigMetadata['@id'],
        '@type': ['EModelAssignmentConfig', 'Entity'],
      },
      microConnectomeConfig: {
        '@id': clonedMicroConnectomeConfigMetadata['@id'],
        '@type': ['MicroConnectomeConfig', 'Entity'],
      },
      macroConnectomeConfig: {
        '@id': clonedMacroConnectomeConfigMetadata['@id'],
        '@type': ['MacroConnectomeConfig', 'Entity'],
      },
      synapseConfig: {
        '@id': clonedSynapseConfigMetadata['@id'],
        '@type': ['SynapseConfig', 'Entity'],
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

  const brainModelConfigSource = await fetchResourceById<BrainModelConfig>(configId, session);

  const renamedModelConfig = {
    ...brainModelConfigSource,
    name,
    description,
  };

  const clonedModelConfigMetadata = await updateResource(renamedModelConfig, session);

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

type GetConfigByNameQueryFnType = (configName: string) => Object;

export async function checkNameIfUniq(
  getConfigsByNameQuery: GetConfigByNameQueryFnType,
  configName: string,
  session: Session
) {
  const query = {
    ...getConfigsByNameQuery(configName),
    fields: ['name'],
    size: 1,
  };

  const sameNameConfigs = await queryES<Pick<SupportedConfigListTypes, 'name'>>(query, session);

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
  fileName: string,
  fileContent: string,
  session: Session
) {
  const createdFile = await createTextFile(fileContent, fileName, session);

  const bbpWorkflowconfig: EntityCreation<BbpWorkflowConfigResource> = {
    '@context': nexus.defaultContext,
    '@type': 'BbpWorkflowConfig',
    distribution: createDistribution(createdFile),
  };

  return createResource(bbpWorkflowconfig, session);
}

export async function getVariantTaskConfigUrlFromCircuit(
  circuitResource: DetailedCircuitResource,
  session: Session
) {
  const query = getVariantTaskActivityByCircuitIdQuery(circuitResource['@id']);

  const variantTaskActivities = await queryES<VariantTaskActivityResource>(query, session);
  const variantTaskActivity = variantTaskActivities[0];

  const variantTaskConfig = await fetchResourceById<VariantTaskConfigResource>(
    variantTaskActivity.used_config['@id'],
    session
  );

  return composeUrl('resource', variantTaskConfig['@id'], { rev: variantTaskConfig._rev });
}

export async function cloneSimCampUIConfig(
  configId: string,
  name: string,
  description: string,
  session: Session
) {
  const simCampUIConfig = await fetchResourceById<SimulationCampaignUIConfig>(configId, session);

  const payload = await fetchJsonFileByUrl(simCampUIConfig.distribution.contentUrl, session);

  const clonedPayloadMeta = await createJsonFile(payload, 'sim-campaign-ui-config.json', session);

  const clonedConfig: EntityCreation<SimulationCampaignUIConfig> = {
    '@context': simCampUIConfig['@context'],
    '@type': simCampUIConfig['@type'],
    distribution: createDistribution(clonedPayloadMeta),
    used: simCampUIConfig.used,
    contribution: simCampUIConfig.contribution,
    name,
    description,
  };

  return createResource<SimulationCampaignUIConfigResource>(clonedConfig, session);
}

export async function renameSimCampUIConfig(
  config: SimulationCampaignUIConfigResource,
  name: string,
  description: string,
  session: Session
) {
  const configId = config['@id'];

  const simCampUIConfigSource = await fetchResourceById<SimulationCampaignUIConfigResource>(
    configId,
    session
  );

  const renamedConfig = {
    ...simCampUIConfigSource,
    name,
    description,
  };

  return updateResource(renamedConfig, session);
}
