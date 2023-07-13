import { atom } from 'jotai';
import debounce from 'lodash/debounce';
import lodashSet from 'lodash/set';
import lodashGet from 'lodash/get';

import {
  mModelRemoteOverridesAtom,
  mModelRemoteOverridesLoadedAtom,
  refetchTriggerAtom,
  configPayloadRevAtom,
  configAtom,
  initialMorphologyAssigmentConfigPayloadAtom,
  mModelOverridesAtom,
  selectedMModelIdAtom,
  accumulativeLocalTopologicalSynthesisParamsAtom,
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
import { generateBrainMTypePairPath } from '@/util/cell-model-assignment';

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
    const mTypeId = get(selectedMModelIdAtom);

    if (!brainRegion || !mTypeId) throw new Error('Brain Region and m-type must be selected');

    // TODO: remove this line when we actually do something with these
    // eslint-disable-next-line no-console
    console.debug(`Fetching M-Model config for (${brainRegion?.title}) - (${mTypeId})...`);
    const paramsResponse = await fetch(mockParamsUrl);
    const params = (await paramsResponse.json()) as ParamConfig;

    const accumulative = get(accumulativeLocalTopologicalSynthesisParamsAtom);

    set(mModelRemoteOverridesAtom, params);
    set(mModelRemoteOverridesLoadedAtom, true);

    const path = [...generateBrainMTypePairPath(brainRegion?.id, mTypeId), 'overrides'];
    const localOverrides = lodashGet(accumulative, path);

    set(mModelOverridesAtom, localOverrides ?? {});

    return params;
  }
);

export const setMModelLocalTopologicalSynthesisParamsAtom = atom<null, [], void>(
  null,
  (get, set) => {
    const selectedBrainRegion = get(selectedBrainRegionAtom);
    const selectedMTypeId = get(selectedMModelIdAtom);

    if (!selectedBrainRegion || !selectedMTypeId)
      throw new Error('Brain Region and m-type must be selected');

    set(setAccumulativeTopologicalSynthesisAtom, selectedBrainRegion.id, selectedMTypeId);
  }
);

export const setAccumulativeTopologicalSynthesisAtom = atom<null, [string, string], void>(
  null,
  (get, set, brainRegionId, mTypeId) => {
    const overrides = get(mModelOverridesAtom);
    const accumulative = structuredClone(get(accumulativeLocalTopologicalSynthesisParamsAtom));

    lodashSet(accumulative, generateBrainMTypePairPath(brainRegionId, mTypeId), {
      // TODO: use proper CanonicalMorphologyModel from nexus
      id: 'https://bbp.epfl.ch/neurosciencegraph/data/b5a28383-82d2-47c8-a803-8b3707cdb44a',
      overrides,
    });
    set(accumulativeLocalTopologicalSynthesisParamsAtom, accumulative);
  }
);

export const setMorphologyAssignmentConfigPayloadAtom = atom<null, [], void>(
  null,
  async (get, set) => {
    set(setMModelLocalTopologicalSynthesisParamsAtom);
    const initialConfigPayload = get(initialMorphologyAssigmentConfigPayloadAtom);
    const localTopologicalSynthesisParams = get(accumulativeLocalTopologicalSynthesisParamsAtom);

    const updatedConfigPayload: MorphologyAssignmentConfigPayload = {
      ...initialConfigPayload,
    };

    updatedConfigPayload.configuration.topological_synthesis = {
      ...localTopologicalSynthesisParams,
    };

    await set(setConfigPayloadAtom, updatedConfigPayload);
  }
);
