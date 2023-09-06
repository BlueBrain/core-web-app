import { atom } from 'jotai';
import isEqual from 'lodash/isEqual';

import invalidateConfigAtom from '../util';
import {
  configAtom,
  configPayloadAtom,
  editsAtom,
  remoteConfigPayloadAtom,
  configPayloadUrlAtom,
  localConfigPayloadAtom,
  configPayloadRevAtom,
  workerAtom,
  triggerRefetchAtom,
} from '.';
import {
  MicroConnectomeEditEntry as EditEntry,
  SerialisibleMicroConnectomeEditEntry as SerialisibleEditEntry,
} from '@/types/connectome';
import { MicroConnectomeConfigPayload, MicroConnectomeConfigResource } from '@/types/nexus';
import { toSerialisibleEdit } from '@/util/connectome';
import sessionAtom from '@/state/session';
import { createDistribution, setRevision } from '@/util/nexus';
import { updateJsonFileByUrl, updateResource } from '@/api/nexus';

export const writingConfigAtom = atom(false);

const persistConfig = atom<null, [], Promise<void>>(null, async (get, set) => {
  const session = get(sessionAtom);

  const config = await get(configAtom);

  const remoteConfigPayload = await get(remoteConfigPayloadAtom);
  const configPayload = await get(configPayloadAtom);

  const configPayloadUrl = await get(configPayloadUrlAtom);
  const configPayloadRev = await get(configPayloadRevAtom);

  if (
    !session ||
    !config ||
    !remoteConfigPayload ||
    !configPayload ||
    !configPayloadUrl ||
    !configPayloadRev
  )
    return;

  if (isEqual(remoteConfigPayload?._ui_data?.editHistory, configPayload?._ui_data?.editHistory))
    return;

  set(writingConfigAtom, true);

  const configPayloadUpdateUrl = setRevision(configPayloadUrl, configPayloadRev);

  const updatedConfigPayloadMeta = await updateJsonFileByUrl(
    configPayloadUpdateUrl,
    configPayload,
    'microconnectome-config.json',
    session
  );

  const updatedConfig: MicroConnectomeConfigResource = {
    ...config,
    distribution: createDistribution(updatedConfigPayloadMeta),
  };

  await updateResource(updatedConfig, config._rev, session);
  await set(invalidateConfigAtom, 'microConnectome');
  set(triggerRefetchAtom);
  set(writingConfigAtom, false);
});

export const setEditsAtom = atom<null, [EditEntry[]], Promise<void>>(
  null,
  async (get, set, edits) => {
    const remoteConfigPayload = await get(remoteConfigPayloadAtom);
    const configPayload = await get(configPayloadAtom);

    if (!configPayload || !remoteConfigPayload) {
      throw new Error('Trying to set edits while the state has not been initialized');
    }

    const serialisibleEditEntries: SerialisibleEditEntry[] = edits.map((edit) =>
      toSerialisibleEdit(edit)
    );

    const updatedConfigPayload: MicroConnectomeConfigPayload = {
      ...configPayload,
      _ui_data: {
        ...configPayload._ui_data,
        editHistory: serialisibleEditEntries,
      },
    };

    set(localConfigPayloadAtom, new WeakMap().set(remoteConfigPayload, updatedConfigPayload));

    set(persistConfig);
  }
);

export const addEditAtom = atom<null, [EditEntry], Promise<void>>(null, async (get, set, edit) => {
  const edits = await get(editsAtom);
  const worker = await get(workerAtom);

  if (!edits || !worker) return;

  await worker.addEdit(edit);

  set(setEditsAtom, [...edits, edit]);
});

export const removeEditAtom = atom<null, [EditEntry], Promise<void>>(
  null,
  async (get, set, editToRemove) => {
    const edits = await get(editsAtom);
    const worker = await get(workerAtom);

    if (!edits || !worker) return;

    await worker.removeEdit(editToRemove);
    set(
      setEditsAtom,
      edits.filter((edit) => edit.id !== editToRemove.id)
    );
  }
);

export const updateEditAtom = atom<null, [EditEntry], Promise<void>>(
  null,
  async (get, set, updatedEdit) => {
    const edits = await get(editsAtom);
    const worker = await get(workerAtom);

    if (!edits || !worker) return;

    await worker.updateEdit(updatedEdit);
    set(
      setEditsAtom,
      edits.map((edit) => (edit.id === updatedEdit.id ? updatedEdit : edit))
    );
  }
);
