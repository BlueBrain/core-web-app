'use client';

import { atom } from 'jotai';
import debounce from 'lodash/debounce';

import { microconnectomeIdAtom } from './index';
import sessionAtom from '@/state/session';
import {
  fetchResourceById,
  fetchJsonFileByUrl,
  fetchFileMetadataByUrl,
  updateJsonFileByUrl,
  updateResource,
  fetchGeneratorTaskActivity,
} from '@/api/nexus';
import {
  GeneratorTaskActivityResource,
  MicroConnectomeConfigPayload,
  MicroConnectomeConfigResource,
} from '@/types/nexus';
import { setRevision } from '@/util/nexus';
import { autoSaveDebounceInterval } from '@/config';
import { Composition } from '@/types/composition';

const refetchTriggerAtom = atom<{}>({});
export const triggerRefetchAtom = atom(null, (get, set) => set(refetchTriggerAtom, {}));

const configAtom = atom<Promise<MicroConnectomeConfigResource | null>>(async (get) => {
  const session = get(sessionAtom);
  const id = await get(microconnectomeIdAtom);

  get(refetchTriggerAtom);

  if (!session || !id) return null;

  return fetchResourceById<MicroConnectomeConfigResource>(id, session);
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

const remoteConfigPayloadAtom = atom<Promise<MicroConnectomeConfigPayload | null>>(async (get) => {
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

  return fetchJsonFileByUrl<MicroConnectomeConfigPayload>(url, session);
});

// This holds a reference to the localConfigPayload by it's remoteConfigPayload
const localConfigPayloadWeakMapAtom = atom<
  WeakMap<MicroConnectomeConfigPayload, MicroConnectomeConfigPayload>
>(new WeakMap());

const setLocalConfigPayloadAtom = atom<null, [MicroConnectomeConfigPayload], Promise<void>>(
  null,
  async (get, set, configPayload) => {
    const remoteConfig = await get(remoteConfigPayloadAtom);

    if (!remoteConfig) return;

    const localConfigPayloadWeakMap = get(localConfigPayloadWeakMapAtom);
    localConfigPayloadWeakMap.set(remoteConfig, configPayload);
  }
);

export const configPayloadAtom = atom<Promise<MicroConnectomeConfigPayload | null>>(async (get) => {
  const remoteConfig = await get(remoteConfigPayloadAtom);

  if (!remoteConfig) return null;

  const localConfig = get(localConfigPayloadWeakMapAtom).get(remoteConfig);

  return localConfig ?? remoteConfig;
});

export const updateConfigPayloadAtom = atom<null, [MicroConnectomeConfigPayload], Promise<void>>(
  null,
  async (get, set, configPayload) => {
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
      'microconnectome-config.json',
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

const triggerUpdateDebouncedAtom = atom<null, [MicroConnectomeConfigPayload], Promise<void>>(
  null,
  debounce(
    (get, set, configPayload) => set(updateConfigPayloadAtom, configPayload),
    autoSaveDebounceInterval
  )
);

const setConfigPayloadAtom = atom<null, [MicroConnectomeConfigPayload], void>(
  null,
  (get, set, configPayload: MicroConnectomeConfigPayload) => {
    set(setLocalConfigPayloadAtom, configPayload);
    set(triggerUpdateDebouncedAtom, configPayload);
  }
);

export const setMicroConnectomePayloadConfigurationAtom = atom<null, [Composition], void>(
  null,
  async (get, set) => {
    const configPayload = await get(configPayloadAtom);

    let updatedConfigPayload: MicroConnectomeConfigPayload = {};

    if (configPayload) {
      updatedConfigPayload = { ...configPayload };
    }

    await set(setConfigPayloadAtom, updatedConfigPayload);
  }
);

const generatorTaskActivityAtom = atom<Promise<GeneratorTaskActivityResource | null>>(
  async (get) => {
    const session = get(sessionAtom);
    const config = await get(configAtom);

    console.log('generator task activity', config)

    if (!session || !config) return null;

    return fetchGeneratorTaskActivity(config['@id'], config._rev, session);
  }
);

export const partialCircuitAtom = atom<Promise<MicroConnectomeConfigResource | null>>(
  async (get) => {
    const session = get(sessionAtom);
    const generatorTaskActivity = await get(generatorTaskActivityAtom);

    console.log('microconnectome config atom', session, generatorTaskActivity)

    if (!session || !generatorTaskActivity) return null;

    return fetchResourceById<MicroConnectomeConfigResource>(
      generatorTaskActivity.generated['@id'],
      session
    );
  }
);
