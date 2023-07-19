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
  fetchedRemoteOverridesMapAtom,
  canonicalMorphologyModelConfigPayloadAtom,
  remoteCanonicalMorphologyModelConfigPayloadAtom,
} from '.';
import { ChangeModelAction, ParamConfig } from '@/types/m-model';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import sessionAtom from '@/state/session';
import { fetchResourceByUrl, updateJsonFileByUrl, updateResource } from '@/api/nexus';
import {
  CanonicalMorphologyModelConfigPayload,
  MorphologyAssignmentConfigPayload,
} from '@/types/nexus';
import { autoSaveDebounceInterval } from '@/config';
import { createGeneratorConfig, setRevision } from '@/util/nexus';
import { mockParamsUrl } from '@/constants/cell-model-assignment/m-model';
import invalidateConfigAtom from '@/state/brain-model-config/util';
import { generateBrainMTypeMapKey, generateBrainMTypePairPath } from '@/util/cell-model-assignment';

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

    if (!brainRegion || !mTypeId) return null;

    if (brainRegion.leaves || !brainRegion.representedInAnnotation) return null;

    const fetchedOverridesMap = get(fetchedRemoteOverridesMapAtom);
    const brainMTypeMapKey = generateBrainMTypeMapKey(brainRegion.id, mTypeId);
    const fetchedInfo = fetchedOverridesMap?.get(brainMTypeMapKey);

    if (fetchedInfo) {
      const accumulative = get(accumulativeLocalTopologicalSynthesisParamsAtom);
      const path = [...generateBrainMTypePairPath(brainRegion.id, mTypeId), 'overrides'];
      const localOverrides = lodashGet(accumulative, path);

      set(mModelOverridesAtom, localOverrides || {});
      set(mModelRemoteOverridesAtom, fetchedInfo);
      set(mModelRemoteOverridesLoadedAtom, true);
      return fetchedInfo;
    }

    const paramsResponse = await fetch(mockParamsUrl);
    const params = (await paramsResponse.json()) as ParamConfig;

    set(mModelOverridesAtom, {});
    set(mModelRemoteOverridesAtom, params);
    fetchedOverridesMap.set(brainMTypeMapKey, params);
    set(fetchedRemoteOverridesMapAtom, fetchedOverridesMap);
    set(mModelRemoteOverridesLoadedAtom, true);
    return params;
  }
);

export const setMModelLocalTopologicalSynthesisParamsAtom = atom<null, [], void>(
  null,
  (get, set) => {
    const selectedBrainRegion = get(selectedBrainRegionAtom);
    const selectedMTypeId = get(selectedMModelIdAtom);

    if (!selectedBrainRegion || !selectedMTypeId) return;

    if (selectedBrainRegion.leaves || !selectedBrainRegion.representedInAnnotation) return;

    set(setAccumulativeTopologicalSynthesisAtom, selectedBrainRegion.id, selectedMTypeId, 'add');
  }
);

export const setAccumulativeTopologicalSynthesisAtom = atom<
  null,
  [string, string, ChangeModelAction],
  void
>(null, (get, set, brainRegionId, mTypeId, action) => {
  const overrides = get(mModelOverridesAtom);
  const accumulative = structuredClone(get(accumulativeLocalTopologicalSynthesisParamsAtom));

  if (action === 'remove') {
    delete accumulative[brainRegionId][mTypeId];
    set(accumulativeLocalTopologicalSynthesisParamsAtom, accumulative);
    return;
  }

  lodashSet(accumulative, generateBrainMTypePairPath(brainRegionId, mTypeId), {
    // TODO: use proper CanonicalMorphologyModel from nexus
    id: 'https://bbp.epfl.ch/neurosciencegraph/data/b5a28383-82d2-47c8-a803-8b3707cdb44a',
    overrides,
  });
  set(accumulativeLocalTopologicalSynthesisParamsAtom, accumulative);
});

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

export const fetchCanonicalMorphologyModelConfigPayloadAtom = atom<null, [], void>(
  null,
  async (get, set) => {
    const session = get(sessionAtom);
    const remoteCanonicalMorphologyModelConfigPayload = await get(
      remoteCanonicalMorphologyModelConfigPayloadAtom
    );

    if (!session || !remoteCanonicalMorphologyModelConfigPayload) return;

    const payloadUrl = remoteCanonicalMorphologyModelConfigPayload.distribution.contentUrl;
    const payload = await fetchResourceByUrl<CanonicalMorphologyModelConfigPayload>(
      payloadUrl,
      session
    );

    // process data to have revision also in the url (hack until the m-type is fixed in composition)
    // https://bbpteam.epfl.ch/project/issues/browse/BBPP134-616
    const processedPayload: CanonicalMorphologyModelConfigPayload = structuredClone(payload);
    const brainRegionIds = Object.keys(processedPayload.hasPart);
    brainRegionIds.forEach((brainRegionId) => {
      const mTypeParentDict = processedPayload.hasPart[brainRegionId].hasPart;
      const mTypeIds = Object.keys(mTypeParentDict);
      mTypeIds.forEach((mTypeId) => {
        const data = mTypeParentDict[mTypeId];
        mTypeParentDict[`${mTypeId}?rev=${data.rev}`] = data;
        delete mTypeParentDict[mTypeId];
      });
    });

    set(canonicalMorphologyModelConfigPayloadAtom, processedPayload);
  }
);
