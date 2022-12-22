import { Session } from 'next-auth';

import defaultCellCompositionConfig from './defaults';
import { nexus } from '@/config';
import { composeUrl, createId, expandId } from '@/util/nexus';
import { BrainModelConfig, BaseEntity, CellComposition, FileMetadata } from '@/types/nexus';
import {
  getEntitiesByIdsQuery,
  getPublicBrainModelConfigsQuery,
  getPersonalBrainModelConfigsQuery,
} from '@/queries/es';

export function fetchJsonFileById<T>(id: string, session: Session) {
  const url = composeUrl('file', id);

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

export function updateJsonFile(
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

export function fetchResourceById<T>(id: string, session: Session) {
  const url = composeUrl('resource', id);

  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
  }).then<T>((res) => res.json());
}

export async function updateResource(resource: BaseEntity, session: Session) {
  const id = resource['@id'];
  const rev = resource._rev;

  const url = composeUrl('resource', id, { rev });

  await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(resource),
  });
}

export async function cloneBrainModelConfig(configId: string, newName: string, session: Session) {
  const createResourceApiUrl = composeUrl('resource', '', { sync: true, schema: null });

  const configSourceUrl = composeUrl('resource', configId, { source: true });

  const brainModelConfigSource: BrainModelConfig = await fetch(configSourceUrl, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
  }).then((res) => res.json());

  const cellCompositionId = brainModelConfigSource.cellComposition['@id'];
  const cellCompositionSourceUrl = composeUrl('resource', cellCompositionId, { source: true });
  const cellComposition: CellComposition = await fetch(cellCompositionSourceUrl, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
  }).then((res) => res.json());

  const cellCompositionConfigId = cellComposition?.distribution?.['@id'];
  const cellCompositionConfigUrl = composeUrl('file', cellCompositionConfigId ?? '');
  const cellCompositionConfig = cellCompositionConfigId
    ? fetchJsonFileById(cellCompositionConfigUrl, session)
    : defaultCellCompositionConfig;

  // cloning CellComposition config (JSON file in the distribution)
  const cellCompositionConfigCloneMeta = await createJsonFile(
    cellCompositionConfig,
    'cell-composition-config',
    session
  );

  // clonning CellComposition itself
  const cellCompositionCloneId = createId('cellcomposition');
  const clonedCellComposition = {
    ...cellComposition,
    '@id': cellCompositionCloneId,
    distribution: {
      // TODO: add more metadata from cellCompositionConfigCloneMeta
      '@id': cellCompositionConfigCloneMeta['@id'],
      '@type': 'DataDownload',
    },
  };
  const clonedCellCompositionMetadata: BaseEntity = await fetch(createResourceApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(clonedCellComposition),
  }).then((res) => res.json());

  // clonning BrainModelConfig
  const brainModelConfigCloneId = createId('modelconfiguration');
  const clonedModelConfig = {
    ...brainModelConfigSource,
    name: newName,
    '@id': brainModelConfigCloneId,
    cellComposition: {
      '@id': clonedCellCompositionMetadata['@id'],
    },
  };

  const clonedModelConfigMetadata: BaseEntity = await fetch(createResourceApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(clonedModelConfig),
  }).then((res) => res.json());

  return clonedModelConfigMetadata;
}

export async function renameBrainModelConfig(
  config: BrainModelConfig,
  newName: string,
  session: Session
) {
  const configId = config['@id'];
  const rev = config._rev;

  const configSourceUrl = composeUrl('resource', configId, { source: true });

  const brainModelConfigSource = await fetch(configSourceUrl, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
  }).then((res) => res.json());

  const renamedModelConfig = {
    ...brainModelConfigSource,
    name: newName,
  };

  const updateApiUrl = composeUrl('resource', renamedModelConfig['@id'], { rev, sync: true });

  const clonedModelConfigMetadata: BaseEntity = await fetch(updateApiUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(renamedModelConfig),
  }).then((res) => res.json());

  return clonedModelConfigMetadata;
}

export async function fetchBrainModelConfigsByIds(
  ids: string[],
  session: Session
): Promise<BrainModelConfig[]> {
  const apiUrl = composeUrl('view', nexus.defaultESIndexId, { viewType: 'es' });
  const expandedIds = ids.map((id) => expandId(id));
  const query = getEntitiesByIdsQuery(expandedIds);

  const configs = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(query),
  })
    .then((res) => res.json())
    .then<BrainModelConfig[]>((res) => res.hits.hits.map((hit: any) => hit._source));

  configs.sort((a, b) => expandedIds.indexOf(a['@id']) - expandedIds.indexOf(b['@id']));

  return configs;
}

export function fetchPublicBrainModels(session: Session): Promise<BrainModelConfig[]> {
  const apiUrl = composeUrl('view', nexus.defaultESIndexId, { viewType: 'es' });
  const query = getPublicBrainModelConfigsQuery();

  return fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(query),
  })
    .then((res) => res.json())
    .then<BrainModelConfig[]>((res) => res.hits.hits.map((hit: any) => hit._source));
}

export function fetchPersonalBrainModels(session: Session): Promise<BrainModelConfig[]> {
  const apiUrl = composeUrl('view', nexus.defaultESIndexId, { viewType: 'es' });
  const query = getPersonalBrainModelConfigsQuery('', session.user.username);

  return fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(query),
  })
    .then((res) => res.json())
    .then<BrainModelConfig[]>((res) => res.hits.hits.map((hit: any) => hit._source));
}
