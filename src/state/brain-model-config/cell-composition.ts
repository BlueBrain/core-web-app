'use client';

import { atom } from 'jotai';
import { selectAtom } from 'jotai/utils';
import debounce from 'lodash/debounce';

import { cellCompositionConfigIdAtom } from './index';
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
  CellCompositionConfigPayload,
  CellCompositionConfigResource,
  CellCompositionResource,
  CompositionOverridesWorkflowConfig,
  GeneratorTaskActivityResource,
} from '@/types/nexus';
import { ROOT_BRAIN_REGION_URI } from '@/constants/brain-hierarchy';
import { setRevision } from '@/util/nexus';
import { autoSaveDebounceInterval } from '@/config';
import { Composition } from '@/types/composition';

const refetchTriggerAtom = atom<{}>({});
export const triggerRefetchAtom = atom(null, (get, set) => set(refetchTriggerAtom, {}));

const configAtom = atom<Promise<CellCompositionConfigResource | null>>(async (get) => {
  const session = get(sessionAtom);
  const id = await get(cellCompositionConfigIdAtom);

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

// This holds a reference to the localConfigPayload by it's remoteConfigPayload
const localConfigPayloadWeakMapAtom = atom<
  WeakMap<CellCompositionConfigPayload, CellCompositionConfigPayload>
>(new WeakMap());

const setLocalConfigPayloadAtom = atom<null, [CellCompositionConfigPayload], Promise<void>>(
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

export const updateConfigPayloadAtom = atom<null, [CellCompositionConfigPayload], Promise<void>>(
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

const triggerUpdateDebouncedAtom = atom<null, [CellCompositionConfigPayload], Promise<void>>(
  null,
  debounce(
    (get, set, configPayload) => set(updateConfigPayloadAtom, configPayload),
    autoSaveDebounceInterval
  )
);

const setConfigPayloadAtom = atom<null, [CellCompositionConfigPayload], void>(
  null,
  (get, set, configPayload: CellCompositionConfigPayload) => {
    set(setLocalConfigPayloadAtom, configPayload);
    set(triggerUpdateDebouncedAtom, configPayload);
  }
);

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

// TODO: move to a separate module
const configPayloadDefaults = {
  VARIANT_DEFINITION: {
    algorithm: 'cell_composition_manipulation',
    version: 'v0.3.1',
  },
  INPUTS: [
    {
      name: 'base_composition_summary',
      type: 'Dataset' as 'Dataset',
      id: 'https://bbp.epfl.ch/neurosciencegraph/data/cellcompositions/81290874-fa53-424b-b5f2-2516f35e24d4',
    },
    {
      name: 'base_density_distribution',
      type: 'Dataset' as 'Dataset',
      id: 'https://bbp.epfl.ch/neurosciencegraph/data/celldensities/760b887c-759a-4ded-98e6-5d2712349eb2',
    },
    {
      name: 'atlas_release',
      type: 'Dataset' as 'Dataset',
      id: 'https://bbp.epfl.ch/neurosciencegraph/data/4906ab85-694f-469d-962f-c0174e901885?rev=2',
    },
  ],
  BASE_ATLAS_DENSITY_DATASET: {
    '@id': 'https://bbp.epfl.ch/neurosciencegraph/data/27652d4d-3a6f-42c7-9833-64396104c445',
    _rev: 10,
  },
};

export const setCompositionPayloadConfigurationAtom = atom<null, [Composition], void>(
  null,
  async (get, set, composition) => {
    const configPayload = await get(configPayloadAtom);

    let updatedConfigPayload: CellCompositionConfigPayload = {};

    if (configPayload) {
      updatedConfigPayload = { ...configPayload };
    }

    updatedConfigPayload[ROOT_BRAIN_REGION_URI] = {
      // This is to replace inputs with the latest base composition summary and distributions
      // TODO: revert back when configs are migrated to use the newest input params
      // TODO: refactor to have separate "focus" atoms for each part of the payload
      // ...(updatedConfigPayload[brainRegionUri] ?? {
      ...{
        variantDefinition: configPayloadDefaults.VARIANT_DEFINITION,
        inputs: configPayloadDefaults.INPUTS,
      },
      jobConfiguration: {},
      configuration: {
        version: composition.version,
        unitCode: composition.unitCode,
        base_atlas_density_dataset: configPayloadDefaults.BASE_ATLAS_DENSITY_DATASET,
        overrides: composition.hasPart as unknown as CompositionOverridesWorkflowConfig,
      },
    };

    await set(setConfigPayloadAtom, updatedConfigPayload);
  }
);

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
