import { atom } from 'jotai';

import {
  selectedEModelIdAtom,
  selectedMModelIdAtom,
  selectedEModelAtom,
  selectedMModelAtom,
  meModelSelfUrlAtom,
  meModelResourceAtom,
} from './me-model';
import sessionAtom from '@/state/session';
import { EntityCreation } from '@/types/nexus';
import { MEModel, MEModelResource } from '@/types/me-model';
import { createResource, fetchResourceById, updateResource } from '@/api/nexus';
import { composeUrl } from '@/util/nexus';
import { VirtualLabInfo } from '@/types/virtual-lab/common';

export const createMEModelAtom = atom<null, [VirtualLabInfo], Promise<MEModelResource | null>>(
  null,
  async (get, set, virtualLabInfo) => {
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
      hasPart: [
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
    const url = composeUrl('resource', '', {
      sync: true,
      schema: null,
      org: virtualLabInfo.virtualLabId,
      project: virtualLabInfo.projectId,
    });

    const meModelResource = await createResource<MEModelResource>(entity, session, url);
    set(meModelSelfUrlAtom, meModelResource._self);
    return meModelResource;
  }
);

export const saveMEModelAtom = atom<null, [string, string], void>(
  null,
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  async (get, set, name, description) => {
    const session = get(sessionAtom);

    const meModelResource = await get(meModelResourceAtom);

    if (!session || !meModelResource) return null;

    const updated: MEModelResource = {
      ...meModelResource,
      name,
      description,
      validated: true,
    };
    await updateResource(updated, session);
  }
);

export const initializeSummaryAtom = atom<null, [string], void>(
  null,
  async (get, set, meModelId) => {
    const session = get(sessionAtom);

    if (!session) return;

    const meModel = await fetchResourceById<MEModelResource>(meModelId, session);
    const usedEModel = meModel.hasPart.find((r) => r['@type'] === 'EModel');
    const usedMModel = meModel.hasPart.find((r) => r['@type'] === 'NeuronMorphology');

    if (!usedEModel || !usedMModel) throw new Error('No EModel or Morphology found for ME-Model');

    set(selectedEModelIdAtom, usedEModel['@id']);
    set(selectedMModelIdAtom, usedMModel['@id']);
    set(meModelSelfUrlAtom, meModel._self);
  }
);
