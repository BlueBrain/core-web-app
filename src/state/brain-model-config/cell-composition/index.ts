'use client';

import { atom } from 'jotai';
import { selectAtom } from 'jotai/utils';

import { cellCompositionConfigIdAtom } from '@/state/brain-model-config';
import sessionAtom from '@/state/session';
import {
  fetchResourceById,
  fetchJsonFileByUrl,
  fetchFileMetadataByUrl,
  fetchGeneratorTaskActivity,
  fetchResourceSourceById,
} from '@/api/nexus';
import {
  CellCompositionConfig,
  CellCompositionConfigPayload,
  CellCompositionConfigResource,
  CellCompositionResource,
  GeneratorTaskActivityResource,
} from '@/types/nexus';
import { setRevision } from '@/util/nexus';

const refetchTriggerAtom = atom<{}>({});
export const triggerRefetchAtom = atom(null, (get, set) => set(refetchTriggerAtom, {}));

export const configAtom = atom<Promise<CellCompositionConfigResource | null>>(async (get) => {
  const session = get(sessionAtom);
  const id = await get(cellCompositionConfigIdAtom);

  get(refetchTriggerAtom);

  if (!session || !id) return null;

  return fetchResourceById<CellCompositionConfigResource>(id, session);
});

export const configSourceAtom = atom<Promise<CellCompositionConfig | null>>(async (get) => {
  const session = get(sessionAtom);
  const id = await get(cellCompositionConfigIdAtom);

  get(refetchTriggerAtom);

  if (!session || !id) return null;

  return fetchResourceSourceById<CellCompositionConfig>(id, session);
});

const configPayloadUrlAtom = selectAtom(configAtom, (config) => config?.distribution.contentUrl);

export const configPayloadRevAtom = atom<Promise<number | null>>(async (get) => {
  const session = get(sessionAtom);
  const configPayloadUrl = await get(configPayloadUrlAtom);

  get(refetchTriggerAtom);

  if (!session || !configPayloadUrl) {
    return null;
  }

  const url = setRevision(configPayloadUrl, null);

  if (!url) {
    return null;
  }

  const metadata = await fetchFileMetadataByUrl(url, session);

  return metadata._rev;
});

const remoteConfigPayloadAtom = atom<Promise<CellCompositionConfigPayload | null>>(async (get) => {
  const session = get(sessionAtom);
  const configPayloadUrl = await get(configPayloadUrlAtom);

  if (!session || !configPayloadUrl) {
    return null;
  }

  const url = configPayloadUrl;

  if (!url) {
    // ? return default value
    return null;
  }

  return fetchJsonFileByUrl<CellCompositionConfigPayload>(url, session);
});

// This holds a reference to the localConfigPayload by it's remoteConfigPayload
const localConfigPayloadWeakMapAtom = atom<
  WeakMap<CellCompositionConfigPayload, CellCompositionConfigPayload>
>(new WeakMap());

export const setLocalConfigPayloadAtom = atom<null, [CellCompositionConfigPayload], Promise<void>>(
  null,
  async (get, set, configPayload) => {
    const remoteConfig = await get(remoteConfigPayloadAtom);

    if (!remoteConfig) return;

    const localConfigPayloadWeakMap = get(localConfigPayloadWeakMapAtom);
    localConfigPayloadWeakMap.set(remoteConfig, configPayload);
  }
);

export const configPayloadAtom = atom<Promise<CellCompositionConfigPayload | null>>(async (get) => {
  const remoteConfig = await get(remoteConfigPayloadAtom);

  if (!remoteConfig) return null;

  const localConfig = get(localConfigPayloadWeakMapAtom).get(remoteConfig);

  return localConfig ?? remoteConfig;
});

export const createGetVariantAtom = (entityId: string) => {
  const selectorFn = (cellCompositionConfigPayload: CellCompositionConfigPayload | null) =>
    cellCompositionConfigPayload?.[entityId].variantDefinition;

  return selectAtom(configPayloadAtom, selectorFn);
};

export const createGetInputsAtom = (entityId: string) => {
  const selectorFn = (cellCompositionConfigPayload: CellCompositionConfigPayload | null) =>
    cellCompositionConfigPayload?.[entityId].inputs;

  return selectAtom(configPayloadAtom, selectorFn);
};

export const createGetConfigurationAtom = (entityId: string) => {
  const selectorFn = (cellCompositionConfigPayload: CellCompositionConfigPayload | null) =>
    cellCompositionConfigPayload?.[entityId]?.configuration;

  return selectAtom(configPayloadAtom, selectorFn);
};

export const createGetJobConfigAtom = (entityId: string) => {
  const selectorFn = (cellCompositionConfigPayload: CellCompositionConfigPayload | null) =>
    cellCompositionConfigPayload?.[entityId].jobConfiguration;

  return selectAtom(configPayloadAtom, selectorFn);
};

const generatorTaskActivityAtom = atom<Promise<GeneratorTaskActivityResource | null>>(
  async (get) => {
    const session = get(sessionAtom);
    const config = await get(configAtom);

    if (!session || !config) return null;

    return fetchGeneratorTaskActivity(config['@id'], config._rev, session);
  }
);

export const cellCompositionAtom = atom<Promise<CellCompositionResource | null>>(async (get) => {
  const session = get(sessionAtom);
  const generatorTaskActivity = await get(generatorTaskActivityAtom);

  if (!session || !generatorTaskActivity) return null;

  return fetchResourceById<CellCompositionResource>(
    generatorTaskActivity.generated['@id'],
    session
  );
});
