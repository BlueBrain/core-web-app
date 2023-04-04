import { atom } from 'jotai';
import debounce from 'lodash/debounce';

import { configAtom, configPayloadAtom, configPayloadRevAtom, setLocalConfigPayloadAtom } from '.';
import invalidateConfigAtom from '@/state/brain-model-config/util';
import sessionAtom from '@/state/session';
import { CellCompositionConfigPayload, CompositionOverridesWorkflowConfig } from '@/types/nexus';
import { setRevision } from '@/util/nexus';
import { updateJsonFileByUrl, updateResource } from '@/api/nexus';
import { autoSaveDebounceInterval } from '@/config';
import { Composition } from '@/types/composition';
import { ROOT_BRAIN_REGION_URI } from '@/constants/brain-hierarchy';

// TODO: move to a separate module
const configPayloadDefaults = {
  VARIANT_DEFINITION: {
    algorithm: 'cell_composition_manipulation',
    version: 'v0.3.3',
  },
  INPUTS: [
    {
      name: 'base_cell_composition',
      type: 'Dataset' as 'Dataset',
      id: 'https://bbp.epfl.ch/neurosciencegraph/data/cellcompositions/fea2f6c6-d09e-4aef-ae9a-6324f01e2467',
    },
  ],
};

export const updateConfigPayloadAtom = atom<null, [CellCompositionConfigPayload], Promise<void>>(
  null,
  async (get, set, configPayload) => {
    const session = get(sessionAtom);
    const rev = await get(configPayloadRevAtom);
    const config = await get(configAtom);

    const url = setRevision(config?.distribution.contentUrl, rev);

    if (!session) {
      throw new Error('No auth session found in the state');
    }

    if (!rev) {
      throw new Error('No revision found in the cell composition config state');
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
    const newFileUrl = setRevision(url, updatedFile._rev);

    config.distribution.contentUrl = newFileUrl;
    config.distribution.contentSize.value = updatedFile._bytes;
    config.distribution.name = updatedFile._filename;
    config.distribution.encodingFormat = updatedFile._mediaType;

    await updateResource(config, config?._rev, session);

    set(invalidateConfigAtom, 'cellComposition');
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

export const setCompositionPayloadConfigurationAtom = atom<null, [Composition], void>(
  null,
  async (get, set, composition) => {
    const configPayload = await get(configPayloadAtom);

    let updatedConfigPayload: CellCompositionConfigPayload = {};

    if (configPayload) {
      updatedConfigPayload = { ...configPayload };
    }

    updatedConfigPayload[ROOT_BRAIN_REGION_URI] = {
      // This is to replace inputs with the latest base composition summary and distributions
      // TODO: revert back when configs are migrated to use the newest input params
      // TODO: refactor to have separate "focus" atoms for each part of the payload
      ...{
        variantDefinition: configPayloadDefaults.VARIANT_DEFINITION,
        inputs: configPayloadDefaults.INPUTS,
      },
      jobConfiguration: {},
      configuration: {
        version: composition.version,
        unitCode: composition.unitCode,
        overrides: composition.hasPart as unknown as CompositionOverridesWorkflowConfig,
      },
    };

    await set(setConfigPayloadAtom, updatedConfigPayload);
  }
);
