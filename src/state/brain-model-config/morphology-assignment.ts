'use client';

import { atom } from 'jotai';
import { selectAtom } from 'jotai/utils';
import debounce from 'lodash/debounce';

import { mModelOverridesAtom, selectedMModelIdAtom } from './cell-model-assignment';
import { morphologyAssignmentConfigIdAtom } from './index';
import sessionAtom from '@/state/session';
import {
  fetchResourceById,
  fetchGeneratorTaskActivity,
  fetchResourceSourceById,
  updateJsonFileByUrl,
  updateResource,
  fetchFileMetadataByUrl,
} from '@/api/nexus';
import {
  MorphologyAssignmentConfigResource,
  DetailedCircuitResource,
  GeneratorTaskActivityResource,
  MorphologyAssignmentConfig,
  MorphologyAssignmentConfigPayload,
} from '@/types/nexus';
import { autoSaveDebounceInterval } from '@/config';
import { createGeneratorConfig, setRevision } from '@/util/nexus';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { MModelWorkflowOverrides } from '@/types/m-model';

const refetchTriggerAtom = atom<{}>({});
export const triggerRefetchAtom = atom(null, (get, set) => set(refetchTriggerAtom, {}));

export const configAtom = atom<Promise<MorphologyAssignmentConfigResource | null>>(async (get) => {
  const session = get(sessionAtom);
  const id = await get(morphologyAssignmentConfigIdAtom);

  get(refetchTriggerAtom);

  if (!session || !id) return null;

  return fetchResourceById<MorphologyAssignmentConfigResource>(id, session);
});

export const configSourceAtom = atom<Promise<MorphologyAssignmentConfig | null>>(async (get) => {
  const session = get(sessionAtom);
  const id = await get(morphologyAssignmentConfigIdAtom);

  get(refetchTriggerAtom);

  if (!session || !id) return null;

  return fetchResourceSourceById<MorphologyAssignmentConfig>(id, session);
});

const generatorTaskActivityAtom = atom<Promise<GeneratorTaskActivityResource | null>>(
  async (get) => {
    const session = get(sessionAtom);
    const config = await get(configAtom);

    if (!session || !config) return null;

    return fetchGeneratorTaskActivity(config['@id'], config._rev, session);
  }
);

export const partialCircuitAtom = atom<Promise<DetailedCircuitResource | null>>(async (get) => {
  const session = get(sessionAtom);
  const generatorTaskActivity = await get(generatorTaskActivityAtom);

  if (!session || !generatorTaskActivity) return null;

  return fetchResourceById<DetailedCircuitResource>(
    generatorTaskActivity.generated['@id'],
    session
  );
});

const configPayloadUrlAtom = selectAtom(configAtom, (config) => config?.distribution.contentUrl);

export const configPayloadRevAtom = atom<Promise<number | null>>(async (get) => {
  const session = get(sessionAtom);
  const configPayloadUrl = await get(configPayloadUrlAtom);

  get(refetchTriggerAtom);

  if (!session || !configPayloadUrl) {
    return null;
  }

  const url = setRevision(configPayloadUrl, null);

  if (!url) {
    return null;
  }

  const metadata = await fetchFileMetadataByUrl(url, session);

  return metadata._rev;
});

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

const initialMorphologyAssigmentConfigPayloadAtom = atom<MorphologyAssignmentConfigPayload>({
  variantDefinition: {
    topological_synthesis: {
      algorithm: 'topological_synthesis',
      version: 'v1',
    },
    placeholder_assignment: {
      algorithm: 'placeholder_assignment',
      version: 'v1',
    },
  },
  defaults: {
    topological_synthesis: {
      id: 'https://bbp.epfl.ch/neurosciencegraph/data/fe237780-92bb-496c-b7b7-620bede319a5',
      type: ['CanonicalMorphologyModelConfig', 'Entity'],
      rev: 1,
    },
    placeholder_assignment: {
      id: 'https://bbp.epfl.ch/neurosciencegraph/data/06b340d4-ac99-4459-bab4-013ef7199c36',
      type: ['PlaceholderMorphologyConfig', 'Entity'],
      rev: 1,
    },
  },
  configuration: {
    topological_synthesis: {},
  },
});

export const getMModelLocalTopologicalSynthesisParamsAtom = atom<MModelWorkflowOverrides>((get) => {
  const selectedBrainRegion = get(selectedBrainRegionAtom);
  const selectedMTypeId = get(selectedMModelIdAtom);

  if (!selectedBrainRegion || !selectedMTypeId)
    throw new Error('Brain Region and m-type must be selected');

  const overrides = get(mModelOverridesAtom);

  return {
    [selectedBrainRegion.id]: {
      [selectedMTypeId]: {
        // TODO: use proper CanonicalMorphologyModel from nexus
        id: 'https://bbp.epfl.ch/neurosciencegraph/data/b5a28383-82d2-47c8-a803-8b3707cdb44a',
        overrides,
      },
    },
  };
});

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
