import { atom } from 'jotai';
import debounce from 'lodash/debounce';

import {
  mModelRemoteOverridesAtom,
  mModelRemoteOverridesLoadedAtom,
  selectedMModelNameAtom,
  refetchTriggerAtom,
  configPayloadRevAtom,
  configAtom,
  initialMorphologyAssigmentConfigPayloadAtom,
  getMModelLocalTopologicalSynthesisParamsAtom,
  mModelOverridesAtom,
} from '.';
import { ParamConfig } from '@/types/m-model';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import sessionAtom from '@/state/session';
import { updateJsonFileByUrl, updateResource } from '@/api/nexus';
import { MorphologyAssignmentConfigPayload } from '@/types/nexus';
import { autoSaveDebounceInterval } from '@/config';
import { createGeneratorConfig, setRevision } from '@/util/nexus';
import { mockParamsUrl } from '@/constants/cell-model-assignment/m-model';
import invalidateConfigAtom from '@/state/brain-model-config/util';

export const triggerRefetchAtom = atom(null, (get, set) => set(refetchTriggerAtom, {}));

export const updateConfigPayloadAtom = atom<
  null,
  [MorphologyAssignmentConfigPayload],
  Promise<void>
>(null, async (get, set, configPayload) => {
  const session = get(sessionAtom);
  const rev = await get(configPayloadRevAtom);
  const config = await get(configAtom);

  const url = setRevision(config?.distribution.contentUrl, rev);

  if (!session) {
    throw new Error('No auth session found in the state');
  }

  if (!rev) {
    throw new Error('No revision found in the morphology assigment config state');
  }

  if (!url) {
    throw new Error('No id found for morphologyAssigmentConfig');
  }

  if (!config) return;

  const updatedFile = await updateJsonFileByUrl(
    url,
    configPayload,
    'morphology-assignment-config.json',
    session
  );

  config.distribution = createGeneratorConfig({
    kgType: 'MorphologyAssignmentConfig',
    payloadMetadata: updatedFile,
  }).distribution;

  await updateResource(config, config?._rev, session);
  await set(invalidateConfigAtom, 'morphologyAssignment');
});

const triggerUpdateDebouncedAtom = atom<null, [MorphologyAssignmentConfigPayload], Promise<void>>(
  null,
  debounce(
    (get, set, configPayload) => set(updateConfigPayloadAtom, configPayload),
    autoSaveDebounceInterval
  )
);

const setConfigPayloadAtom = atom<null, [MorphologyAssignmentConfigPayload], void>(
  null,
  (get, set, configPayload: MorphologyAssignmentConfigPayload) => {
    set(triggerUpdateDebouncedAtom, configPayload);
  }
);

export const fetchMModelRemoteOverridesAtom = atom<null, [], Promise<ParamConfig | null>>(
  null,
  async (get, set) => {
    const brainRegion = get(selectedBrainRegionAtom);
    const mType = get(selectedMModelNameAtom);

    // TODO: remove this line when we actually do something with these
    // eslint-disable-next-line no-console
    console.debug(`Fetching M-Model config for (${brainRegion?.title}) - (${mType})...`);
    const paramsResponse = await fetch(mockParamsUrl);
    const params = (await paramsResponse.json()) as ParamConfig;

    set(mModelRemoteOverridesAtom, params);
    set(mModelRemoteOverridesLoadedAtom, true);
    set(mModelOverridesAtom, {});
    return params;
  }
);

export const setMorphologyAssignmentConfigPayloadAtom = atom<null, [], void>(
  null,
  async (get, set) => {
    const initialConfigPayload = get(initialMorphologyAssigmentConfigPayloadAtom);
    const localTopologicalSynthesisParams = get(getMModelLocalTopologicalSynthesisParamsAtom);

    const updatedConfigPayload: MorphologyAssignmentConfigPayload = {
      ...initialConfigPayload,
    };

    updatedConfigPayload.configuration.topological_synthesis = {
      ...localTopologicalSynthesisParams,
    };

    await set(setConfigPayloadAtom, updatedConfigPayload);
  }
);
