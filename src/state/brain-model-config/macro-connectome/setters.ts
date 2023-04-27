'use client';

import { atom } from 'jotai';

import {
  configPayloadAtom,
  connectivityStrengthMatrixAtom,
  editsAtom,
  localConfigPayloadAtom,
  localConnectivityStrengthMatrixAtom,
  remoteConfigPayloadAtom,
  remoteConnectivityStrengthMatrixAtom,
} from './base';
import { BrainRegionIdx } from '@/types/common';
import { MacroConnectomeEditEntry, WholeBrainConnectivityMatrix } from '@/types/connectome';
import { getFlatArrayValueIdx, applyConnectivityMatrixEdit as applyEdit } from '@/util/connectome';


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

export const deleteEdits = atom<null, [BrainRegionIdx[]], Promise<void>>(
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
