import { atom } from 'jotai';

import {
  selectedEModelIdAtom,
  selectedMModelIdAtom,
  selectedEModelAtom,
  selectedMModelAtom,
} from './me-model';
import sessionAtom from '@/state/session';
import { EntityCreation } from '@/types/nexus';
import { MEModel, MEModelResource } from '@/types/me-model';
import { createResource, fetchResourceById } from '@/api/nexus';

export const createMEModelAtom = atom<null, [], Promise<MEModelResource | null>>(
  null,
  async (get) => {
    const session = get(sessionAtom);
    const selectedMModel = await get(selectedMModelAtom);
    const selectedEModel = await get(selectedEModelAtom);

    if (!session || !selectedMModel || !selectedEModel) return null;

    const entity: EntityCreation<MEModel> = {
      '@type': ['Entity', 'MEModel'],
      '@context': 'https://bbp.neuroshapes.org',
      // these name and description will be filled properly when the user saves the me-model
      name: `WIP ME-Model - ${selectedMModel.name}`,
      description: 'TODO',
      used: [
        {
          '@type': 'EModel',
          '@id': selectedEModel['@id'],
        },
        {
          '@type': 'NeuronMorphology',
          '@id': selectedMModel['@id'],
        },
      ],
      // 'image' will be added after me-model validation
      validated: false,
      status: 'initalized',
    };

    return createResource<MEModelResource>(entity, session);
  }
);

export const saveMEModelAtom = atom<null, [string, string], Promise<MEModelResource | null>>(
  null,
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  async (get, set, name, description) => {
    // TODO: implement update resource
    return null;
  }
);

export const initializeSummaryAtom = atom<null, [string], void>(
  null,
  async (get, set, meModelId) => {
    const session = get(sessionAtom);

    if (!session) return;

    const meModel = await fetchResourceById<MEModelResource>(meModelId, session);
    const usedEModel = meModel.used.find((r) => r['@type'] === 'EModel');
    const usedMModel = meModel.used.find((r) => r['@type'] === 'NeuronMorphology');

    if (!usedEModel || !usedMModel) throw new Error('No EModel or Morphology found for ME-Model');

    set(selectedEModelIdAtom, usedEModel['@id']);
    set(selectedMModelIdAtom, usedMModel['@id']);
  }
);
