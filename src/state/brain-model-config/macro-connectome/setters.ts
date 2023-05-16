'use client';

import { atom } from 'jotai';
import isEqual from 'lodash/isEqual';
import { tableToIPC } from '@apache-arrow/es5-cjs';

import invalidateConfigAtom from '../util';
import {
  refetchCounterAtom,
  configPayloadAtom,
  remoteConfigPayloadAtom,
  localConfigPayloadAtom,
  connectivityStrengthOverridesEntityAtom,
  connectivityStrengthOverridesEntitySourceAtom,
  connectivityStrengthMatrixAtom,
  remoteConnectivityStrengthMatrixAtom,
  localConnectivityStrengthMatrixAtom,
  connectivityStrengthOverridesPayloadUrlAtom,
  connectivityStrengthOverridesPayloadRevAtom,
  configPayloadUrlAtom,
  configPayloadRevAtom,
  configAtom,
  configSourceAtom,
  connectivityStrengthOverridesEntityRevAtom,
  initialConnectivityStrengthMatrixAtom,
} from '.';
import { createDistribution, setRevision } from '@/util/nexus';
import { MacroConnectomeEditEntry, WholeBrainConnectivityMatrix } from '@/types/connectome';
import {
  applyConnectivityMatrixEdit as applyEdit,
  createMacroConnectomeOverridesTable,
} from '@/util/connectome';
import sessionAtom from '@/state/session';
import { brainRegionLeavesUnsortedArrayAtom } from '@/state/brain-regions';
import { updateFileByUrl, updateJsonFileByUrl, updateResource } from '@/api/nexus';
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
  const configPayloadRev = await get(configPayloadRevAtom);

  const overridesEntity = await get(connectivityStrengthOverridesEntityAtom);
  const overridesEntitySource = await get(connectivityStrengthOverridesEntitySourceAtom);
  const overridesEntityRev = await get(connectivityStrengthOverridesEntityRevAtom);

  const overridesPayloadUrl = await get(connectivityStrengthOverridesPayloadUrlAtom);
  const overridesPayloadRevAtom = await get(connectivityStrengthOverridesPayloadRevAtom);

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
    !overridesPayloadUrl ||
    !overridesPayloadRevAtom
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

  const overridesPayloadUpdateUrl = setRevision(overridesPayloadUrl, overridesPayloadRevAtom);

  const updatedOverridesPayloadMeta = await updateFileByUrl(
    overridesPayloadUpdateUrl,
    overridesBuffer,
    'overrides.arrow',
    'application/arrow',
    session
  );

  overridesEntitySource.distribution = createDistribution(updatedOverridesPayloadMeta);

  const updatedOverridesEntityMeta = await updateResource(
    overridesEntitySource,
    overridesEntityRev,
    session
  );

  configPayload.overrides.connection_strength.rev = updatedOverridesEntityMeta._rev;

  const configPayloadUpdateUrl = setRevision(configPayloadUrl, configPayloadRev);

  const updatedConfigPayloadMeta = await updateJsonFileByUrl(
    configPayloadUpdateUrl,
    configPayload,
    'macroconnectome-config.json',
    session
  );

  configSource.distribution = createDistribution(updatedConfigPayloadMeta);

  await updateResource(configSource, config._rev, session);

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

export const setEditsAtom = atom<null, [MacroConnectomeEditEntry[]], Promise<void>>(
  null,
  async (get, set, edits) => {
    const remoteConfigPayload = await get(remoteConfigPayloadAtom);
    const configPayload = await get(configPayloadAtom);
    const initialConnectivityStrengthMatrix = await get(initialConnectivityStrengthMatrixAtom);

    if (!configPayload || !remoteConfigPayload || !initialConnectivityStrengthMatrix) {
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

    const matrix = structuredClone(initialConnectivityStrengthMatrix);
    edits.forEach((edit) => applyEdit(matrix, edit));
    set(setConnectivityStrengthMatrixAtom, { ...matrix });

    set(persistConfig);
  }
);
