'use client';

import { atom } from 'jotai';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import { tableToIPC } from '@apache-arrow/es5-cjs';

import invalidateConfigAtom from '../util';
import {
  refetchCounterAtom,
  configPayloadAtom,
  remoteConfigPayloadAtom,
  localConfigPayloadAtom,
  editsAtom,
  connectivityStrengthMatrixAtom,
  remoteConnectivityStrengthMatrixAtom,
  localConnectivityStrengthMatrixAtom,
  connectivityStrengthOverridesPayloadUrlAtom,
  connectivityStrengthOverridesPayloadRevAtom,
  configPayloadUrlAtom,
  configPayloadRevAtom,
} from '.';
import { setRevision } from '@/util/nexus';
import { autoSaveDebounceInterval } from '@/config';
import { MacroConnectomeEditEntry, WholeBrainConnectivityMatrix } from '@/types/connectome';
import {
  applyConnectivityMatrixEdit as applyEdit,
  createMacroConnectomeOverridesTable,
} from '@/util/connectome';
import sessionAtom from '@/state/session';
import { brainRegionLeavesUnsortedArrayAtom } from '@/state/brain-regions';
import { updateFileByUrl, updateJsonFileByUrl } from '@/api/nexus';
import { MacroConnectomeConfigPayload } from '@/types/nexus';

export const triggerRefetchAtom = atom(null, (get, set) =>
  set(refetchCounterAtom, (counter) => counter + 1)
);

const persistConfig = atom<null, [], Promise<void>>(null, async (get, set) => {
  const session = get(sessionAtom);

  const remoteConnectivityStrengthMatrix = await get(remoteConnectivityStrengthMatrixAtom);
  const connectivityStrengthMatrix = await get(connectivityStrengthMatrixAtom);

  const brainRegionLeaves = await get(brainRegionLeavesUnsortedArrayAtom);

  const remoteConfigPayload = await get(remoteConfigPayloadAtom);
  const configPayload = await get(configPayloadAtom);

  const configPayloadUrl = await get(configPayloadUrlAtom);
  const configPayloadRev = await get(configPayloadRevAtom);

  const overridesPayloadUrl = await get(connectivityStrengthOverridesPayloadUrlAtom);
  const overridesPayloadRevAtom = await get(connectivityStrengthOverridesPayloadRevAtom);

  if (
    !session ||
    !brainRegionLeaves ||
    !remoteConnectivityStrengthMatrix ||
    !connectivityStrengthMatrix ||
    !remoteConfigPayload ||
    !configPayload ||
    !overridesPayloadUrl ||
    !overridesPayloadRevAtom
  ) {
    throw new Error('Trying to persist a config while it has not been initialized ');
  }

  if (isEqual(remoteConfigPayload?._ui_data?.editHistory, configPayload?._ui_data?.editHistory))
    return;

  const overridesTable = createMacroConnectomeOverridesTable(
    brainRegionLeaves,
    remoteConnectivityStrengthMatrix,
    connectivityStrengthMatrix
  );

  const overridesBuffer = tableToIPC(overridesTable, 'file').buffer;

  const overridesPayloadUpdateUrl = setRevision(overridesPayloadUrl, overridesPayloadRevAtom);

  await updateFileByUrl(
    overridesPayloadUpdateUrl,
    overridesBuffer,
    'overrides.arrow',
    'application/arrow',
    session
  );

  const configPayloadUpdateUrl = setRevision(configPayloadUrl, configPayloadRev);

  await updateJsonFileByUrl(
    configPayloadUpdateUrl,
    configPayload,
    'macroconnectome-config.json',
    session
  );

  await set(invalidateConfigAtom, 'macroConnectome');
});

const persistConfigDebounced = atom<null, [], Promise<void>>(
  null,
  debounce((get, set) => set(persistConfig), autoSaveDebounceInterval)
);

const setConnectivityStrengthMatrixAtom = atom<null, [WholeBrainConnectivityMatrix], Promise<void>>(
  null,
  async (get, set, matrix) => {
    const remoteMatrix = await get(remoteConnectivityStrengthMatrixAtom);

    if (!remoteMatrix) {
      throw new Error('Trying to set connectivity matrix while it has not been initialized');
    }

    set(localConnectivityStrengthMatrixAtom, new WeakMap().set(remoteMatrix, matrix));
  }
);

const setEditsAtom = atom<null, [MacroConnectomeEditEntry[]], Promise<void>>(
  null,
  async (get, set, edits) => {
    const remoteConfigPayload = await get(remoteConfigPayloadAtom);
    const configPayload = await get(configPayloadAtom);

    if (!configPayload || !remoteConfigPayload) {
      throw new Error('Trying to set edits while the state has not been initialized');
    }

    const updatedConfigPayload: MacroConnectomeConfigPayload = {
      ...configPayload,
      _ui_data: {
        ...configPayload._ui_data,
        editHistory: edits,
      },
    };

    set(localConfigPayloadAtom, new WeakMap().set(remoteConfigPayload, updatedConfigPayload));

    set(persistConfigDebounced);
  }
);

export const addEdit = atom<null, [MacroConnectomeEditEntry], Promise<void>>(
  null,
  async (get, set, edit) => {
    const currentMatrix = await get(connectivityStrengthMatrixAtom);
    const remoteMatrix = await get(remoteConnectivityStrengthMatrixAtom);
    const edits = await get(editsAtom);

    if (!currentMatrix || !remoteMatrix) return;

    const matrix = currentMatrix === remoteMatrix ? structuredClone(currentMatrix) : currentMatrix;

    applyEdit(matrix, edit);

    set(setConnectivityStrengthMatrixAtom, { ...matrix });
    set(setEditsAtom, [...edits, edit]);
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

    if (editIdxs.some((idx) => !edits[idx])) {
      throw new Error(`Index is out of range`);
    }

    const updatedEdits = edits.filter((edit, idx) => !editIdxs.includes(idx));

    const matrix = currentMatrix === remoteMatrix ? structuredClone(currentMatrix) : currentMatrix;

    updatedEdits.forEach((edit) => applyEdit(matrix, edit));

    set(setConnectivityStrengthMatrixAtom, { ...matrix });
    set(setEditsAtom, updatedEdits);
  }
);
