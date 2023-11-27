'use client';

import isEqual from 'lodash/isEqual';
import { atom } from 'jotai';
import { loadable } from 'jotai/utils';
import { wrap } from 'comlink';

import { microConnectomeConfigIdAtom } from '../index';
import sessionAtom from '@/state/session';
import {
  fetchResourceById,
  fetchGeneratorTaskActivity,
  fetchJsonFileByUrl,
  fetchFileByUrl,
} from '@/api/nexus';
import {
  MicroConnectomeConfigResource,
  DetailedCircuitResource,
  GeneratorTaskActivityResource,
  MicroConnectomeConfigPayload,
  MicroConnectomeVariantSelectionResource,
  MicroConnectomeData,
} from '@/types/nexus';
import {
  InitFn,
  CreateAggregatedVariantViewFn,
  CreateAggregatedParamViewFn,
  AddEditFn,
  RemoveEditFn,
  UpdateEditFn,
  SaveOverridesFn,
} from '@/components/connectome-definition/micro/micro-connectome-worker';
import { MicroConnectomeEditEntry } from '@/types/connectome';
import { fromSerialisibleSelection } from '@/util/connectome';
import { supportedUIConfigVersion } from '@/constants/configs';

export const refetchCounterAtom = atom<number>(0);
export const triggerRefetchAtom = atom(null, (get, set) =>
  set(refetchCounterAtom, (counter) => counter + 1)
);

export const configAtom = atom<Promise<MicroConnectomeConfigResource | null>>(async (get) => {
  const session = get(sessionAtom);
  const id = await get(microConnectomeConfigIdAtom);

  get(refetchCounterAtom);

  if (!session || !id) return null;

  return fetchResourceById<MicroConnectomeConfigResource>(id, session);
});

export const configPayloadUrlAtom = atom<Promise<string | null>>(async (get) => {
  const config = await get(configAtom);
  if (!config) return null;

  if (config.configVersion !== supportedUIConfigVersion.microConnectomeConfig) {
    throw new Error('Config version is not supported by micro connectome editor');
  }

  return config.distribution.contentUrl;
});

export const remoteConfigPayloadAtom = atom<Promise<MicroConnectomeConfigPayload | null>>(
  async (get) => {
    const session = get(sessionAtom);
    const configPayloadUrl = await get(configPayloadUrlAtom);

    if (!session || !configPayloadUrl) {
      return null;
    }

    return fetchJsonFileByUrl<MicroConnectomeConfigPayload>(configPayloadUrl, session);
  }
);

export const localConfigPayloadAtom = atom<
  WeakMap<MicroConnectomeConfigPayload, MicroConnectomeConfigPayload>
>(new WeakMap());

export const configPayloadAtom = atom<Promise<MicroConnectomeConfigPayload | null>>(async (get) => {
  const remoteConfigPayload = await get(remoteConfigPayloadAtom);

  if (!remoteConfigPayload) return null;

  const localConfigPayload = get(localConfigPayloadAtom).get(remoteConfigPayload);

  return localConfigPayload ?? remoteConfigPayload;
});

export const configPayloadLoadableAtom = loadable(configPayloadAtom);

export const editsAtom = atom<Promise<MicroConnectomeEditEntry[] | null>>(async (get) => {
  const configPayload = await get(configPayloadAtom);

  if (!configPayload) return null;

  const editEntries: MicroConnectomeEditEntry[] = (
    configPayload._ui_data?.editHistory ?? []
  ).map<MicroConnectomeEditEntry>(
    (serialisibleEditEntry) =>
      ({
        ...serialisibleEditEntry,
        srcSelection: fromSerialisibleSelection(serialisibleEditEntry.srcSelection),
        dstSelection: fromSerialisibleSelection(serialisibleEditEntry.dstSelection),
        // TODO investigate what's going on with these types, remove type assertion
      } as MicroConnectomeEditEntry)
  );

  return editEntries;
});

export const editsLoadableAtom = loadable(editsAtom);

export const hasUnsavedEditsAtom = atom<Promise<boolean>>(async (get) => {
  const remoteConfigPayload = await get(remoteConfigPayloadAtom);
  const configPayload = await get(configPayloadAtom);

  const remoteEditHistory = remoteConfigPayload?._ui_data?.editHistory;
  const editHistory = configPayload?._ui_data?.editHistory;

  if (!remoteEditHistory || !editHistory) return false;

  return (
    remoteEditHistory.length !== editHistory.length ||
    remoteEditHistory.some(
      // A workaround to compare edit objects which might contain proprties
      // that are: not defined in one object and have undefined value in the other.
      // Default isEqual behaviour is to report a diffference in such a case,
      // and that is unwanted here.
      // TODO Find a better solution.
      (edit, idx) => !isEqual(edit, JSON.parse(JSON.stringify(editHistory[idx])))
    )
  );
});

export const initialVariantMatrix = atom<Promise<ArrayBuffer | null>>(async (get) => {
  const session = get(sessionAtom);
  const configPayload = await get(configPayloadAtom);

  if (!session || !configPayload) return null;

  const { id, rev } = configPayload.initial.variants;

  const containerEntity = await fetchResourceById<MicroConnectomeVariantSelectionResource>(
    id,
    session,
    { rev }
  );

  const variantMatrixArrayBuffer = await fetchFileByUrl(
    containerEntity.distribution.contentUrl,
    session
  ).then((res) => res.arrayBuffer());

  return variantMatrixArrayBuffer;
});

export const overridesVariantMatrix = atom<Promise<ArrayBuffer | null>>(async (get) => {
  const session = get(sessionAtom);
  const configPayload = await get(configPayloadAtom);

  if (!session || !configPayload) return null;

  const { id, rev } = configPayload.overrides.variants;

  const containerEntity = await fetchResourceById<MicroConnectomeVariantSelectionResource>(
    id,
    session,
    { rev }
  );

  const arrayBuffer = await fetchFileByUrl(containerEntity.distribution.contentUrl, session).then(
    (res) => res.arrayBuffer()
  );

  return arrayBuffer;
});

type ParamMatrices = {
  [variantName: string]: ArrayBuffer;
};

export const initialParamMatrices = atom<Promise<ParamMatrices | null>>(async (get) => {
  const session = get(sessionAtom);
  const configPayload = await get(configPayloadAtom);

  if (!session || !configPayload) return null;

  const variantNames = Object.keys(configPayload.variants);

  const paramArrayBufferPromises = variantNames.map(async (variantName) => {
    const { id, rev } = configPayload.initial[variantName];

    const containerEntity = await fetchResourceById<MicroConnectomeData>(id, session, { rev });

    const paramArrayBuffer = await fetchFileByUrl(
      containerEntity.distribution.contentUrl,
      session
    ).then((res) => res.arrayBuffer());

    return paramArrayBuffer;
  });

  const arrayBuffers = await Promise.all(paramArrayBufferPromises);

  return variantNames.reduce(
    (acc, variantName, idx) => ({ ...acc, [variantName]: arrayBuffers[idx] }),
    {}
  );
});

export const overridesParamMatrices = atom<Promise<ParamMatrices | null>>(async (get) => {
  const session = get(sessionAtom);
  const configPayload = await get(configPayloadAtom);

  if (!session || !configPayload) return null;

  const variantNames = Object.keys(configPayload.variants);

  const paramArrayBufferPromises = variantNames.map(async (variantName) => {
    const { id, rev } = configPayload.overrides[variantName];

    const containerEntity = await fetchResourceById<MicroConnectomeData>(id, session, { rev });

    const paramArrayBuffer = await fetchFileByUrl(
      containerEntity.distribution.contentUrl,
      session
    ).then((res) => res.arrayBuffer());

    return paramArrayBuffer;
  });

  const arrayBuffers = await Promise.all(paramArrayBufferPromises);

  return variantNames.reduce(
    (acc, variantName, idx) => ({ ...acc, [variantName]: arrayBuffers[idx] }),
    {}
  );
});

type WorkerFn = {
  init: InitFn;
  createAggregatedVariantView: CreateAggregatedVariantViewFn;
  createAggregatedParamView: CreateAggregatedParamViewFn;
  addEdit: AddEditFn;
  removeEdit: RemoveEditFn;
  updateEdit: UpdateEditFn;
  saveOverrides: SaveOverridesFn;
};

// ? To be instantiated in the component?
export const workerAtom = atom(() => {
  const nativeWorker = new Worker(
    new URL('@/components/connectome-definition/micro/micro-connectome-worker.ts', import.meta.url),
    { name: 'micro-connectome-worker' }
  );
  return wrap<WorkerFn>(nativeWorker);
});

const generatorTaskActivityAtom = atom<Promise<GeneratorTaskActivityResource | null>>(
  async (get) => {
    const session = get(sessionAtom);
    const config = await get(configAtom);

    if (!session || !config) return null;

    return fetchGeneratorTaskActivity(config['@id'], config._rev, session);
  }
);

export const partialCircuitAtom = atom<Promise<DetailedCircuitResource | null>>(async (get) => {
  const session = get(sessionAtom);
  const generatorTaskActivity = await get(generatorTaskActivityAtom);

  if (!session || !generatorTaskActivity) return null;

  return fetchResourceById<DetailedCircuitResource>(
    generatorTaskActivity.generated['@id'],
    session
  );
});
