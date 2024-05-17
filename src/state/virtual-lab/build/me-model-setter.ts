import { atom } from 'jotai';

import { selectedEModelAtom, selectedMModelAtom } from './me-model';
import sessionAtom from '@/state/session';
import { EntityCreation } from '@/types/nexus';
import { MEModel, MEModelResource } from '@/types/me-model';
import { createResource } from '@/api/nexus';

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
