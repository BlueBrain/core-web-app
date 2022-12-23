'use client';

import { atom } from 'jotai';
import { selectAtom } from 'jotai/utils';

import { getCellCompositionIdAtom } from './index';
import sessionAtom from '@/state/session';
import {
  fetchResourceById,
  fetchJsonFileById,
  fetchFileMetadataById,
  updateJsonFile,
} from '@/api/nexus';
import { CellComposition, CellCompositionConfig } from '@/types/nexus';
import { debounce } from '@/util/common';
import { autoSaveDebounceInterval } from '@/config';

const refetchTriggerAtom = atom<{}>({});
export const triggerRefetchAtom = atom(null, (get, set) => set(refetchTriggerAtom, {}));

const cellCompositionAtom = atom<Promise<CellComposition | null>>(async (get) => {
  const session = get(sessionAtom);
  const id = await get(getCellCompositionIdAtom);

  if (!session || !id) return null;

  return fetchResourceById<CellComposition>(id, session);
});

const cellCompositionConfigRevAtom = atom<Promise<number | null>>(async (get) => {
  const session = get(sessionAtom);
  const cellComposition = await get(cellCompositionAtom);

  get(refetchTriggerAtom);

  if (!session || !cellComposition) {
    return null;
  }

  const id = cellComposition?.distribution['@id'];

  if (!id) {
    return null;
  }

  const metadata = await fetchFileMetadataById(id, session);

  return metadata._rev;
});

const localCellCompositionConfigAtom = atom<CellCompositionConfig | null>(null);

const remoteCellCompositionConfigAtom = atom<Promise<CellCompositionConfig | null>>(async (get) => {
  const session = get(sessionAtom);
  const cellComposition = await get(cellCompositionAtom);

  get(cellCompositionConfigRevAtom); // this is a workaround to preload rev

  if (!session || !cellComposition) {
    return null;
  }

  const id = cellComposition?.distribution['@id'];

  if (!id) {
    // ? return default value
    return null;
  }

  return fetchJsonFileById<CellCompositionConfig>(id, session);
});

export const cellCompositionConfigAtom = atom<Promise<CellCompositionConfig | null>>(
  async (get) => {
    const localConfig = get(localCellCompositionConfigAtom);
    const remoteConfig = await get(remoteCellCompositionConfigAtom);

    if (localConfig) {
      return localConfig;
    }

    return remoteConfig;
  }
);

export const updateCellCompositionConfigAtom = atom(
  null,
  async (get, set, cellCompositionConfig: CellCompositionConfig) => {
    const session = get(sessionAtom);
    const rev = await get(cellCompositionConfigRevAtom);
    const cellComposition = await get(cellCompositionAtom);

    const id = cellComposition?.distribution['@id'];

    if (!session) {
      throw new Error('No auth session found in the state');
    }

    if (!rev) {
      throw new Error('No revision found in the cell composition config state');
    }

    if (!id) {
      throw new Error('No id found for cellCompositionConfig');
    }

    await updateJsonFile(id, cellCompositionConfig, 'cell-composition-config.json', rev, session);

    set(triggerRefetchAtom);
  }
);

const triggerUpdateDebouncedAtom = atom(
  null,
  debounce(async (get: any, set: any) => {
    // TODO: type this function properly
    const updatedConfig = get(localCellCompositionConfigAtom);

    set(updateCellCompositionConfigAtom, updatedConfig);
  }, autoSaveDebounceInterval)
);

const setCellCompositionConfigAtom = atom(
  null,
  async (get, set, cellCompositionConfig: CellCompositionConfig) => {
    set(localCellCompositionConfigAtom, cellCompositionConfig);
    set(triggerUpdateDebouncedAtom);
  }
);

export const createGetProtocolAtom = (entityId: string) => {
  const selectorFn = (cellCompositionConfig: CellCompositionConfig | null) =>
    cellCompositionConfig?.[entityId].hasProtocol;

  return selectAtom(cellCompositionConfigAtom, selectorFn);
};

export const createGetParameterAtom = (entityId: string) => {
  const selectorFn = (cellCompositionConfig: CellCompositionConfig | null) =>
    cellCompositionConfig?.[entityId].hasParameter;

  return selectAtom(cellCompositionConfigAtom, selectorFn);
};

export const createGetConfigurationAtom = (entityId: string) => {
  const selectorFn = (cellCompositionConfig: CellCompositionConfig | null) =>
    cellCompositionConfig?.[entityId]?.configuration;

  return selectAtom(cellCompositionConfigAtom, selectorFn);
};

type SetConfigurationValue = {
  entityId: string;
  config: any;
};
export const setConfigurationAtom = atom(
  null,
  async (get, set, { entityId, config }: SetConfigurationValue) => {
    const cellCompositionConfig = await get(cellCompositionConfigAtom);

    if (!cellCompositionConfig) {
      return;
    }

    cellCompositionConfig[entityId] = {
      ...(cellCompositionConfig[entityId] ?? {}),
      configuration: config,
    };

    set(setCellCompositionConfigAtom, cellCompositionConfig);
  }
);

export const createGetJobConfigAtom = (entityId: string) => {
  const selectorFn = (cellCompositionConfig: CellCompositionConfig | null) =>
    cellCompositionConfig?.[entityId].jobConfiguration;

  return selectAtom(cellCompositionConfigAtom, selectorFn);
};
