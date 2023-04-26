'use client';

import { atom } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { tableFromIPC, Table } from '@apache-arrow/es5-cjs';

import { macroConnectomeConfigIdAtom } from '.';
import { brainRegionLeaveIdxByNotationMapAtom } from '@/state/brain-regions';
import sessionAtom from '@/state/session';
import {
  MacroConnectomeConfigPayload,
  MacroConnectomeConfigResource,
  WholeBrainConnectomeStrengthResource,
} from '@/types/nexus';
import { fetchResourceById, fetchFileByUrl, fetchJsonFileByUrl } from '@/api/nexus';
import {
  HemisphereDirection,
  MacroConnectomeEditEntry,
  WholeBrainConnectivityMatrix,
} from '@/types/connectome';
import { getFlatArrayValueIdx, applyConnectivityMatrixEdit as applyEdit } from '@/util/connectome';

const refetchTriggerAtom = atom<number>(0);
export const triggerRefetchAtom = atom(null, (get, set) =>
  set(refetchTriggerAtom, (counter) => counter + 1)
);

export const configAtom = atom<Promise<MacroConnectomeConfigResource | null>>(async (get) => {
  const session = get(sessionAtom);
  const id = await get(macroConnectomeConfigIdAtom);

  get(refetchTriggerAtom);

  if (!session || !id) return null;

  return fetchResourceById<MacroConnectomeConfigResource>(id, session);
});

const configPayloadUrlAtom = selectAtom(configAtom, (config) => config?.distribution.contentUrl);

const remoteConfigPayloadAtom = atom<Promise<MacroConnectomeConfigPayload | null>>(
  async (get) => {
    const session = get(sessionAtom);
    const configPayloadUrl = await get(configPayloadUrlAtom);

    if (!session || !configPayloadUrl) {
      return null;
    }

    return fetchJsonFileByUrl<MacroConnectomeConfigPayload>(configPayloadUrl, session);
  }
);

const localConfigPayloadAtom = atom<
  WeakMap<MacroConnectomeConfigPayload, MacroConnectomeConfigPayload>
>(new WeakMap());

const configPayloadAtom = atom<Promise<MacroConnectomeConfigPayload | null>>(async (get) => {
  const remoteConfigPayload = await get(remoteConfigPayloadAtom);

  if (!remoteConfigPayload) return null;

  const localConfigPayload = get(localConfigPayloadAtom).get(remoteConfigPayload);

  return localConfigPayload ?? remoteConfigPayload;
});

const initialConnectivityStrengthEntityAtom = atom<
  Promise<WholeBrainConnectomeStrengthResource | null>
>(async (get) => {
  const session = get(sessionAtom);
  const configPayload = await get(configPayloadAtom);

  if (!session || !configPayload) return null;

  const { id, rev } = configPayload.bases.connection_strength;

  return fetchResourceById(id, session, { rev });
});

const initialConnectivityStrengthTableAtom = atom<Promise<Table | null>>(async (get) => {
  const session = get(sessionAtom);
  const initialConnectivityStrengthEntity = await get(initialConnectivityStrengthEntityAtom);

  if (!session || !initialConnectivityStrengthEntity) return null;

  return tableFromIPC(
    fetchFileByUrl(initialConnectivityStrengthEntity.distribution.contentUrl, session)
  );
});

const connectivityStrengthOverridesEntityAtom = atom<
  Promise<WholeBrainConnectomeStrengthResource | null>
>(async (get) => {
  const session = get(sessionAtom);
  const configPayload = await get(configPayloadAtom);

  if (!session || !configPayload) return null;

  const { id, rev } = configPayload.overrides.connection_strength;

  return fetchResourceById(id, session, { rev });
});

const connectivityStrengthOverridesTableAtom = atom<Promise<Table | null>>(async (get) => {
  const session = get(sessionAtom);
  const connectivityStrengthOverridesEntity = await get(connectivityStrengthOverridesEntityAtom);

  if (!session || !connectivityStrengthOverridesEntity) return null;

  return tableFromIPC(
    fetchFileByUrl(connectivityStrengthOverridesEntity?.distribution.contentUrl, session)
  );
});

const remoteConnectivityStrengthMatrixAtom = atom<Promise<WholeBrainConnectivityMatrix | null>>(
  async (get) => {
    const brainRegionLeaveIdxByNotationMap = await get(brainRegionLeaveIdxByNotationMapAtom);
    const initialConnectivityStrengthTable = await get(initialConnectivityStrengthTableAtom);
    const connectivityStrengthOverridesTable = await get(connectivityStrengthOverridesTableAtom);

    if (
      !brainRegionLeaveIdxByNotationMap ||
      !initialConnectivityStrengthTable ||
      !connectivityStrengthOverridesTable
    )
      return null;

    const totalLeaves = brainRegionLeaveIdxByNotationMap.size;
    const flatArraySize = totalLeaves * totalLeaves;

    const matrix = {
      LL: new Float64Array(flatArraySize),
      LR: new Float64Array(flatArraySize),
      RL: new Float64Array(flatArraySize),
      RR: new Float64Array(flatArraySize),
    };

    initialConnectivityStrengthTable.toArray().forEach((record) => {
      const srcIdx = brainRegionLeaveIdxByNotationMap.get(record.src) as number;
      const dstIdx = brainRegionLeaveIdxByNotationMap.get(record.dst) as number;

      const idx = getFlatArrayValueIdx(totalLeaves, srcIdx, dstIdx);

      matrix[record.side as HemisphereDirection][idx] = record.value;
    });

    connectivityStrengthOverridesTable.toArray().forEach((record) => {
      const srcIdx = brainRegionLeaveIdxByNotationMap.get(record.src) as number;
      const dstIdx = brainRegionLeaveIdxByNotationMap.get(record.dst) as number;

      const idx = getFlatArrayValueIdx(totalLeaves, srcIdx, dstIdx);

      matrix[record.side as HemisphereDirection][idx] = record.value;
    });

    return matrix;
  }
);

const localConnectivityStrengthMatrixAtom = atom<
  WeakMap<WholeBrainConnectivityMatrix, WholeBrainConnectivityMatrix>
>(new WeakMap());

export const connectivityStrengthMatrixAtom = atom<Promise<WholeBrainConnectivityMatrix | null>>(
  async (get) => {
    const remoteMatrix = await get(remoteConnectivityStrengthMatrixAtom);

    if (!remoteMatrix) return null;

    const localMatrix = get(localConnectivityStrengthMatrixAtom).get(remoteMatrix);

    return localMatrix ?? remoteMatrix;
  }
);

const setConnectivityStrengthMatrixAtom = atom<
  null,
  [WholeBrainConnectivityMatrix],
  Promise<void>
>(null, async (get, set, matrix) => {
  const remoteMatrix = await get(remoteConnectivityStrengthMatrixAtom);

  if (!remoteMatrix) {
    throw new Error('Trying to set connectivity matrix while it has not been initialized');
  }

  set(localConnectivityStrengthMatrixAtom, new WeakMap().set(remoteMatrix, matrix));
});

export const editsAtom = selectAtom(
  configPayloadAtom,
  (configPayload) => configPayload?.editHistory
);

const setEditsAtom = atom<null, [MacroConnectomeEditEntry[]], Promise<void>>(
  null,
  async (get, set, edits) => {
    const remoteConfigPayload = await get(remoteConfigPayloadAtom);
    const configPayload = await get(configPayloadAtom);

    if (!configPayload || !remoteConfigPayload) {
      throw new Error('Trying to set edits while the state has not been initialized');
    }

    const updatedConfigPayload = { ...configPayload, editHistory: edits };

    set(localConfigPayloadAtom, new WeakMap().set(remoteConfigPayload, updatedConfigPayload));
  }
);

export const addEdit = atom<null, [MacroConnectomeEditEntry], Promise<void>>(
  null,
  async (get, set, edit) => {
    const currentMatrix = await get(connectivityStrengthMatrixAtom);
    const remoteMatrix = await get(remoteConnectivityStrengthMatrixAtom);
    const edits = await get(editsAtom);

    if (!currentMatrix || !remoteMatrix || edits) return;

    const matrix = currentMatrix === remoteMatrix ? structuredClone(currentMatrix) : currentMatrix;

    applyEdit(matrix, edit);

    set(setConnectivityStrengthMatrixAtom, { ...matrix });
  }
);

export const deleteEdits = atom<null, [number[]], Promise<void>>(
  null,
  async (get, set, editIdxs) => {
    const currentMatrix = await get(connectivityStrengthMatrixAtom);
    const remoteMatrix = await get(remoteConnectivityStrengthMatrixAtom);
    const edits = await get(editsAtom);

    if (!currentMatrix || !remoteMatrix || !edits) {
      throw new Error(
        'Trying to set connectivity matrix edits while the state has not been initialized'
      );
    }

    if (editIdxs.some((idx) => edits[idx])) {
      throw new Error(`Index is out of range`);
    }

    const updatedEdits = edits.filter((edit, idx) => !editIdxs.includes(idx));

    const matrix = currentMatrix === remoteMatrix ? structuredClone(currentMatrix) : currentMatrix;

    updatedEdits.forEach((edit) => applyEdit(matrix, edit));

    set(setConnectivityStrengthMatrixAtom, { ...matrix });
    set(setEditsAtom, updatedEdits);
  }
);
