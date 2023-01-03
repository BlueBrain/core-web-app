'use client';

import { atom } from 'jotai';
import { selectAtom } from 'jotai/utils';

import sessionAtom from '../session';
import { getCellCompositionConfigIdAtom } from './index';
import {
  fetchResourceById,
  fetchJsonFileByUrl,
  fetchFileMetadataByUrl,
  updateJsonFileByUrl,
} from '@/api/nexus';
import { CellCompositionConfigPayload, CellCompositionConfigResource } from '@/types/nexus';
import { debounce } from '@/util/common';
import { autoSaveDebounceInterval } from '@/config';

const refetchTriggerAtom = atom<{}>({});
export const triggerRefetchAtom = atom(null, (get, set) => set(refetchTriggerAtom, {}));

const configAtom = atom<Promise<CellCompositionConfigResource | null>>(async (get) => {
  const session = get(sessionAtom);
  const id = await get(getCellCompositionConfigIdAtom);

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

  const url = config?.configuration.contentUrl;

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

  get(configPayloadRevAtom); // this is a workaround to preload rev

  if (!session || !config) {
    return null;
  }

  const url = config?.configuration.contentUrl;

  if (!url) {
    // ? return default value
    return null;
  }

  return fetchJsonFileByUrl<CellCompositionConfigPayload>(url, session);
});

export const configPayloadAtom = atom<Promise<CellCompositionConfigPayload | null>>(async (get) => {
  const localConfig = get(localConfigPayloadAtom);
  const remoteConfig = await get(remoteConfigPayloadAtom);

  if (localConfig) {
    return localConfig;
  }

  return remoteConfig;
});

export const updateConfigPayloadAtom = atom(
  null,
  async (get, set, configPayload: CellCompositionConfigPayload) => {
    const session = get(sessionAtom);
    const rev = await get(configPayloadRevAtom);
    const config = await get(configAtom);

    const url = config?.configuration.contentUrl;

    if (!session) {
      throw new Error('No auth session found in the state');
    }

    if (!rev) {
      throw new Error('No revision found in the cell composition config state');
    }

    if (!url) {
      throw new Error('No id found for cellCompositionConfig');
    }

    await updateJsonFileByUrl(url, configPayload, 'cell-composition-config.json', session);

    // update the config to point to the new payload

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

    if (!configPayload) {
      return;
    }

    configPayload[entityId] = {
      ...(configPayload[entityId] ?? {}),
      configuration: config,
    };

    set(setConfigPayloadAtom, configPayload);
  }
);

export const createGetJobConfigAtom = (entityId: string) => {
  const selectorFn = (cellCompositionConfigPayload: CellCompositionConfigPayload | null) =>
    cellCompositionConfigPayload?.[entityId].jobConfiguration;

  return selectAtom(configPayloadAtom, selectorFn);
};
