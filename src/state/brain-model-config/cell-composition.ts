'use client';

import { atom } from 'jotai/vanilla';
import { selectAtom } from 'jotai/vanilla/utils';

import { getCellCompositionConfigIdAtom } from './index';
import sessionAtom from '@/state/session';
import {
  fetchResourceById,
  fetchJsonFileByUrl,
  fetchFileMetadataByUrl,
  updateJsonFileByUrl,
  updateResource,
} from '@/api/nexus';
import { CellCompositionConfigPayload, CellCompositionConfigResource } from '@/types/nexus';
import { debounce } from '@/util/common';
import { setRevision } from '@/util/nexus';
import { autoSaveDebounceInterval } from '@/config';

const refetchTriggerAtom = atom<{}>({});
export const triggerRefetchAtom = atom(null, (get, set) => set(refetchTriggerAtom, {}));
export const cellCompositionHasChanged = atom<boolean>(false);

const configAtom = atom<Promise<CellCompositionConfigResource | null>>(async (get) => {
  const session = get(sessionAtom);
  const id = await get(getCellCompositionConfigIdAtom);

  get(refetchTriggerAtom);

  if (!session || !id) return null;

  return fetchResourceById<CellCompositionConfigResource>(id, session);
});

const configPayloadRevAtom = atom<Promise<number | null>>(async (get) => {
  const session = get(sessionAtom);
  const config = await get(configAtom);

  get(refetchTriggerAtom);

  if (!session || !config) {
    return null;
  }

  const url = setRevision(config?.distribution.contentUrl, null);

  if (!url) {
    return null;
  }

  const metadata = await fetchFileMetadataByUrl(url, session);

  return metadata._rev;
});

const localConfigPayloadAtom = atom<CellCompositionConfigPayload | null>(null);

const remoteConfigPayloadAtom = atom<Promise<CellCompositionConfigPayload | null>>(async (get) => {
  const session = get(sessionAtom);
  const config = await get(configAtom);

  if (!session || !config) {
    return null;
  }

  const url = config?.distribution.contentUrl;

  if (!url) {
    // ? return default value
    return null;
  }

  return fetchJsonFileByUrl<CellCompositionConfigPayload>(url, session);
});

export const configPayloadAtom = atom<Promise<CellCompositionConfigPayload | null>>(async (get) => {
  const localConfig = get(localConfigPayloadAtom);

  if (localConfig) {
    return localConfig;
  }

  const remoteConfig = await get(remoteConfigPayloadAtom);

  return remoteConfig;
});

export const updateConfigPayloadAtom = atom(
  null,
  async (get, set, configPayload: CellCompositionConfigPayload) => {
    const session = get(sessionAtom);
    const rev = await get(configPayloadRevAtom);
    const config = await get(configAtom);

    const url = setRevision(config?.distribution.contentUrl, rev);

    if (!session) {
      throw new Error('No auth session found in the state');
    }

    if (!rev) {
      throw new Error('No revision found in the cell composition config state');
    }

    if (!url) {
      throw new Error('No id found for cellCompositionConfig');
    }

    if (!config) return;

    const updatedFile = await updateJsonFileByUrl(
      url,
      configPayload,
      'cell-composition-config.json',
      session
    );
    const newFileUrl = setRevision(url, updatedFile._rev);

    config.distribution.contentUrl = newFileUrl;
    config.distribution.contentSize.value = updatedFile._bytes;
    config.distribution.name = updatedFile._filename;
    config.distribution.encodingFormat = updatedFile._mediaType;

    await updateResource(config, config?._rev, session);

    set(triggerRefetchAtom);
  }
);

const triggerUpdateDebouncedAtom = atom(
  null,
  debounce(async (get: any, set: any) => {
    // TODO: type this function properly
    const updatedConfig = get(localConfigPayloadAtom);

    set(updateConfigPayloadAtom, updatedConfig);
  }, autoSaveDebounceInterval)
);

const setConfigPayloadAtom = atom(
  null,
  async (get, set, cellCompositionConfigPayload: CellCompositionConfigPayload) => {
    set(cellCompositionHasChanged, true);
    set(localConfigPayloadAtom, cellCompositionConfigPayload);
    set(triggerUpdateDebouncedAtom);
  }
);

export const createGetProtocolAtom = (entityId: string) => {
  const selectorFn = (cellCompositionConfigPayload: CellCompositionConfigPayload | null) =>
    cellCompositionConfigPayload?.[entityId].hasProtocol;

  return selectAtom(configPayloadAtom, selectorFn);
};

export const createGetParameterAtom = (entityId: string) => {
  const selectorFn = (cellCompositionConfigPayload: CellCompositionConfigPayload | null) =>
    cellCompositionConfigPayload?.[entityId].hasParameter;

  return selectAtom(configPayloadAtom, selectorFn);
};

export const createGetConfigurationAtom = (entityId: string) => {
  const selectorFn = (cellCompositionConfigPayload: CellCompositionConfigPayload | null) =>
    cellCompositionConfigPayload?.[entityId]?.configuration;

  return selectAtom(configPayloadAtom, selectorFn);
};

type SetConfigurationValue = {
  entityId: string;
  config: any;
};
export const setConfigurationAtom = atom(
  null,
  async (get, set, { entityId, config }: SetConfigurationValue) => {
    const configPayload = await get(configPayloadAtom);
    let localConfigPayload: CellCompositionConfigPayload = {};

    if (configPayload) {
      localConfigPayload = { ...configPayload };
    }

    localConfigPayload[entityId] = {
      ...(localConfigPayload[entityId] ?? {
        hasProtocol: { algorithm: 'algorithmId', version: 'v0.0.1' },
      }),
      configuration: config,
    };

    await set(setConfigPayloadAtom, localConfigPayload);
  }
);

export const createGetJobConfigAtom = (entityId: string) => {
  const selectorFn = (cellCompositionConfigPayload: CellCompositionConfigPayload | null) =>
    cellCompositionConfigPayload?.[entityId].jobConfiguration;

  return selectAtom(configPayloadAtom, selectorFn);
};
