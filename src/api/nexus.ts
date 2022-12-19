import { Session } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';

import { nexus } from '@/config';
import { composeUrl } from '@/util/nexus';
import { BrainModelConfig, BaseEntity, CellComposition } from '@/types/nexus';
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

  const cellCompositionCloneId = `https://bbp.epfl.ch/neurosciencegraph/data/cellcompositions/${uuidv4()}`;
  const clonedCellComposition = {
    ...cellComposition,
    '@id': cellCompositionCloneId,
  };
  const clonedCellCompositionMetadata: BaseEntity = await fetch(createResourceApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(clonedCellComposition),
  }).then((res) => res.json());

  const brainModelConfigCloneId = `https://bbp.epfl.ch/neurosciencegraph/data/modelconfigurations/${uuidv4()}`;

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

export function fetchBrainModelConfigsByIds(
  ids: string[],
  session: Session
): Promise<BrainModelConfig[]> {
  const apiUrl = composeUrl('view', nexus.defaultESIndexId, { viewType: 'es' });
  const query = getEntitiesByIdsQuery(ids);

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
