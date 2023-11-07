'use client';

import { atom } from 'jotai';
import isEqual from 'lodash/isEqual';
import { tableToIPC } from '@apache-arrow/es2015-esm';

import invalidateConfigAtom from '../util';
import {
  refetchCounterAtom,
  configPayloadAtom,
  remoteConfigPayloadAtom,
  localConfigPayloadAtom,
  connectivityStrengthOverridesEntityAtom,
  connectivityStrengthOverridesEntitySourceAtom,
  editsAtom,
  connectivityStrengthMatrixAtom,
  remoteConnectivityStrengthMatrixAtom,
  localConnectivityStrengthMatrixAtom,
  connectivityStrengthOverridesPayloadUrlAtom,
  configPayloadUrlAtom,
  configAtom,
  configSourceAtom,
  connectivityStrengthOverridesEntityRevAtom,
  initialConnectivityStrengthMatrixAtom,
} from '.';
import { createDistribution } from '@/util/nexus';
import { MacroConnectomeEditEntry, WholeBrainConnectivityMatrix } from '@/types/connectome';
import {
  applyConnectivityMatrixEdit as applyEdit,
  createMacroConnectomeOverridesTable,
} from '@/util/connectome';
import sessionAtom from '@/state/session';
import { brainRegionLeavesUnsortedArrayAtom } from '@/state/brain-regions';
import { fetchLatestRev, updateFileByUrl, updateJsonFileByUrl, updateResource } from '@/api/nexus';
import { MacroConnectomeConfigPayload } from '@/types/nexus';

export const writingConfigAtom = atom(false);

export const triggerRefetchAtom = atom(null, (get, set) =>
  set(refetchCounterAtom, (counter) => counter + 1)
);

const persistConfig = atom<null, [], Promise<void>>(null, async (get, set) => {
  const session = get(sessionAtom);

  const config = await get(configAtom);
  const configSource = await get(configSourceAtom);

  const initialConnectivityStrengthMatrix = await get(initialConnectivityStrengthMatrixAtom);
  const connectivityStrengthMatrix = await get(connectivityStrengthMatrixAtom);

  const brainRegionLeaves = await get(brainRegionLeavesUnsortedArrayAtom);

  const remoteConfigPayload = await get(remoteConfigPayloadAtom);
  const configPayload = await get(configPayloadAtom);

  const configPayloadUrl = await get(configPayloadUrlAtom);

  const overridesEntity = await get(connectivityStrengthOverridesEntityAtom);
  const overridesEntitySource = await get(connectivityStrengthOverridesEntitySourceAtom);
  const overridesEntityRev = await get(connectivityStrengthOverridesEntityRevAtom);

  const overridesPayloadUrl = await get(connectivityStrengthOverridesPayloadUrlAtom);

  if (
    !session ||
    !config ||
    !configSource ||
    !brainRegionLeaves ||
    !overridesEntity ||
    !overridesEntitySource ||
    !overridesEntityRev ||
    !initialConnectivityStrengthMatrix ||
    !connectivityStrengthMatrix ||
    !remoteConfigPayload ||
    !configPayload ||
    !configPayloadUrl ||
    !overridesPayloadUrl
  ) {
    throw new Error('Trying to persist a config while it has not been initialized ');
  }

  if (isEqual(remoteConfigPayload?._ui_data?.editHistory, configPayload?._ui_data?.editHistory))
    return;

  set(writingConfigAtom, true);

  const overridesTable = createMacroConnectomeOverridesTable(
    brainRegionLeaves,
    initialConnectivityStrengthMatrix,
    connectivityStrengthMatrix
  );

  const overridesBuffer = tableToIPC(overridesTable, 'file').buffer;

  const overridesPayloadLatestRev = await fetchLatestRev(overridesPayloadUrl, session);

  const overridesPayloadUpdateUrl = overridesPayloadUrl.replace(
    /rev=\d+/,
    `rev=${overridesPayloadLatestRev}`
  );

  const updatedOverridesPayloadMeta = await updateFileByUrl(
    overridesPayloadUpdateUrl,
    overridesBuffer,
    'overrides.arrow',
    'application/arrow',
    session
  );

  overridesEntitySource.distribution = createDistribution(updatedOverridesPayloadMeta);

  const updatedOverridesEntityMeta = await updateResource(overridesEntitySource, session);

  configPayload.overrides.connection_strength.rev = updatedOverridesEntityMeta._rev;

  const updatedConfigPayloadMeta = await updateJsonFileByUrl(
    configPayloadUrl,
    configPayload,
    'macroconnectome-config.json',
    session
  );

  configSource.distribution = createDistribution(updatedConfigPayloadMeta);

  await updateResource(configSource, session);

  await set(invalidateConfigAtom, 'macroConnectome');
  set(writingConfigAtom, false);
});

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

    set(persistConfig);
  }
);

export const addEditAtom = atom<null, [MacroConnectomeEditEntry], Promise<void>>(
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

export const applyEditsAtom = atom<null, [MacroConnectomeEditEntry[]], Promise<void>>(
  null,
  async (get, set, edits) => {
    const initialMatrix = await get(initialConnectivityStrengthMatrixAtom);

    if (!initialMatrix) return;

    const matrix = structuredClone(initialMatrix);

    edits.forEach((e) => applyEdit(matrix, e));

    set(setConnectivityStrengthMatrixAtom, matrix);
    set(setEditsAtom, edits);
  }
);
