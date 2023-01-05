import { Session } from 'next-auth';

import { nexus } from '@/config';
import {
  composeUrl,
  createCellCompositionConfig,
  createCellPositionConfig,
  createId,
  expandId,
} from '@/util/nexus';
import {
  BrainModelConfig,
  FileMetadata,
  CellCompositionConfig,
  CellPositionConfig,
  EntityResource,
  BrainModelConfigResource,
  Entity,
} from '@/types/nexus';
import {
  getEntitiesByIdsQuery,
  getPublicBrainModelConfigsQuery,
  getPersonalBrainModelConfigsQuery,
  getBrainModelConfigsByNameQuery,
} from '@/queries/es';

// #################################### Generic methods ##########################################

export function fetchJsonFileById<T>(id: string, session: Session) {
  const url = composeUrl('file', id);

  return fetch(url, {
    headers: {
      Accept: '*/*',
      Authorization: `Bearer ${session.accessToken}`,
    },
  }).then<T>((res) => res.json());
}

export function fetchJsonFileByUrl<T>(url: string, session: Session) {
  return fetch(url, {
    headers: {
      Accept: '*/*',
      Authorization: `Bearer ${session.accessToken}`,
    },
  }).then<T>((res) => res.json());
}

export function fetchFileMetadataById(id: string, session: Session) {
  const url = composeUrl('file', id);

  return fetch(url, {
    headers: {
      Accept: 'application/ld+json',
      Authorization: `Bearer ${session.accessToken}`,
    },
  }).then<FileMetadata>((res) => res.json());
}

export function fetchFileMetadataByUrl(url: string, session: Session) {
  return fetch(url, {
    headers: {
      Accept: 'application/ld+json',
      Authorization: `Bearer ${session.accessToken}`,
    },
  }).then<FileMetadata>((res) => res.json());
}

export function createJsonFile(data: any, filename: string, session: Session) {
  const url = composeUrl('file', '');

  const formData = new FormData();
  const dataBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  formData.append('file', dataBlob, filename);

  return fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: formData,
  }).then<FileMetadata>((res) => res.json());
}

export function updateJsonFileById(
  id: string,
  data: any,
  filename: string,
  rev: number,
  session: Session
) {
  const url = composeUrl('file', id, { rev });

  const formData = new FormData();
  const dataBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  formData.append('file', dataBlob, filename);

  return fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: formData,
  }).then<FileMetadata>((res) => res.json());
}

export function updateJsonFileByUrl(url: string, data: any, filename: string, session: Session) {
  const formData = new FormData();
  const dataBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  formData.append('file', dataBlob, filename);

  return fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: formData,
  }).then<FileMetadata>((res) => res.json());
}

export function fetchResourceById<T>(id: string, session: Session) {
  const url = composeUrl('resource', id);

  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
  }).then<T>((res) => res.json());
}

export function fetchResourceSourceById<T>(id: string, session: Session) {
  const url = composeUrl('resource', id, { source: true });

  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
  }).then<T>((res) => res.json());
}

export function createResource<T extends EntityResource>(
  resource: Record<string, any>,
  session: Session
) {
  const createResourceApiUrl = composeUrl('resource', '', { sync: true, schema: null });

  return fetch(createResourceApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(resource),
  }).then<T>((res) => res.json());
}

export async function updateResource(resource: Entity, rev: number, session: Session) {
  const id = resource['@id'];

  const url = composeUrl('resource', id, { rev, sync: true });

  await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(resource),
  });
}

export function queryES<T>(query: Record<string, any>, session: Session) {
  const apiUrl = composeUrl('view', nexus.defaultESIndexId, { viewType: 'es' });

  return fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(query),
  })
    .then((res) => res.json())
    .then<T[]>((res) => res.hits.hits.map((hit: any) => hit._source));
}

// #################################### Non-generic methods ##########################################

async function cloneOrCreateCellCompositionConfig(id: string | null, session: Session) {
  if (id) {
    // clone existing config and payload
    const configSource = await fetchResourceSourceById<CellCompositionConfig>(id, session);
    const payload = await fetchJsonFileByUrl(configSource.configuration.contentUrl, session);
    const clonedPayloadMeta = await createJsonFile(
      payload,
      'cell-composition-config.json',
      session
    );

    const clonedConfig: CellCompositionConfig = {
      ...configSource,
      '@id': createId('cellcompositionconfig'),
      configuration: createCellCompositionConfig({ payloadMetadata: clonedPayloadMeta })
        .configuration,
    };

    return createResource(clonedConfig, session);
  }

  // create new
  const payload = {};
  const payloadMetadata = await createJsonFile(payload, 'cell-composition-config.json', session);
  const config = createCellCompositionConfig({
    id: createId('cellcompositionconfig'),
    payloadMetadata,
  });

  return createResource(config, session);
}

async function cloneOrCreateCellPositionConfig(id: string | null, session: Session) {
  if (id) {
    // clone existing config
    const configSource = await fetchResourceSourceById<CellPositionConfig>(id, session);
    configSource['@id'] = createId('cellpositionconfig');
    return createResource(configSource, session);
  }

  // create a new one
  const config = createCellPositionConfig({ id: createId('cellpositionconfig') });
  return createResource(config, session);
}

export async function cloneBrainModelConfig(
  configId: string,
  name: string,
  description: string,
  session: Session
) {
  const brainModelConfigSource = await fetchResourceSourceById<BrainModelConfig>(configId, session);

  const cellCompositionConfigId = brainModelConfigSource.cellCompositionConfig?.['@id'] ?? null;
  const clonedCellCompositionConfigMetadata = await cloneOrCreateCellCompositionConfig(
    cellCompositionConfigId,
    session
  );

  const cellPositionConfigId = brainModelConfigSource.cellPositionConfig?.['@id'] ?? null;
  const clonedCellPositionConfigMetadata = await cloneOrCreateCellPositionConfig(
    cellPositionConfigId,
    session
  );

  // cloning BrainModelConfig
  const clonedModelConfig = {
    ...brainModelConfigSource,
    '@id': createId('modelconfiguration'),
    name,
    description,
    cellCompositionConfig: {
      '@id': clonedCellCompositionConfigMetadata['@id'],
    },
    cellPositionConfig: {
      '@id': clonedCellPositionConfigMetadata['@id'],
    },
  };

  return createResource<BrainModelConfigResource>(clonedModelConfig, session);
}

export async function renameBrainModelConfig(
  config: BrainModelConfigResource,
  newName: string,
  session: Session
) {
  const configId = config['@id'];
  const rev = config._rev;

  const brainModelConfigSource = await fetchResourceSourceById<BrainModelConfig>(configId, session);

  const renamedModelConfig = {
    ...brainModelConfigSource,
    name: newName,
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
  const query = getPersonalBrainModelConfigsQuery('', session.user.username);

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
