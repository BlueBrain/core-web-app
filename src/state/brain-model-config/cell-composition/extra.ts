import { atom } from 'jotai';
import debounce from 'lodash/debounce';
import { omitDeep } from 'deepdash-es/standalone';
import lodashSet from 'lodash/set';

import { configAtom, configPayloadAtom, setLocalConfigPayloadAtom } from '.';
import invalidateConfigAtom from '@/state/brain-model-config/util';
import sessionAtom from '@/state/session';
import { CellCompositionConfigPayload, CompositionOverridesWorkflowConfig } from '@/types/nexus';
import { createDistribution } from '@/util/nexus';
import { updateJsonFileByUrl, updateResource } from '@/api/nexus';
import { autoSaveDebounceInterval } from '@/config';
import { ROOT_BRAIN_REGION_URI } from '@/constants/brain-hierarchy';
import { OriginalComposition } from '@/types/composition/original';
import openNotification from '@/api/notifications';

export const updateConfigPayloadAtom = atom<null, [CellCompositionConfigPayload], Promise<void>>(
  null,
  async (get, set, configPayload) => {
    const session = get(sessionAtom);
    const config = await get(configAtom);

    const url = config?.distribution.contentUrl;

    if (!session) {
      throw new Error('No auth session found in the state');
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

    config.distribution = createDistribution(updatedFile);

    await updateResource(config, session);
    await set(invalidateConfigAtom, 'cellComposition');
    openNotification('success', 'The composition was successfully saved');
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

const getOverridesFromCellComposition = (composition: OriginalComposition) => {
  const overrides = omitDeep(composition.hasPart, 'extendedNodeId', {
    onMatch: { skipChildren: true },
  });
  return overrides as CompositionOverridesWorkflowConfig;
};

export const setCompositionPayloadConfigurationAtom = atom<null, [OriginalComposition], void>(
  null,
  async (get, set, composition) => {
    const configPayload = await get(configPayloadAtom);

    if (!configPayload) throw new Error('no payload to save');

    const updatedConfigPayload: CellCompositionConfigPayload = structuredClone(configPayload);

    const path = [ROOT_BRAIN_REGION_URI, 'configuration', 'overrides'];
    lodashSet(updatedConfigPayload, path, getOverridesFromCellComposition(composition));

    await set(setConfigPayloadAtom, updatedConfigPayload);
  }
);
