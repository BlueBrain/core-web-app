import { atom } from 'jotai';
import { atomWithDefault } from 'jotai/utils';

import {
  selectedEModelIdAtom,
  selectedMModelIdAtom,
  selectedEModelAtom,
  selectedMModelAtom,
  meModelSelfUrlAtom,
  meModelResourceAtom,
} from './me-model';
import sessionAtom from '@/state/session';
import { BrainLocation, EntityCreation } from '@/types/nexus';
import { MEModel, MEModelResource } from '@/types/me-model';
import { createResource, fetchResourceById, updateResource } from '@/api/nexus';
import { composeUrl } from '@/util/nexus';
import { VirtualLabInfo } from '@/types/virtual-lab/common';
import { nexus } from '@/config';

type MEModelDetails = {
  description: string;
  name: string;
  brainRegion?: { id: string; title: string };
};

export const meModelDetailsAtom = atomWithDefault<MEModelDetails | null>(() => null);

export const createMEModelAtom = atom<null, [VirtualLabInfo], Promise<MEModelResource | null>>(
  null,
  async (get, set, virtualLabInfo) => {
    const session = get(sessionAtom);
    const selectedMModel = await get(selectedMModelAtom);
    const selectedEModel = await get(selectedEModelAtom);
    const meModelDetails = get(meModelDetailsAtom);

    if (!session || !meModelDetails || !selectedMModel || !selectedEModel) return null;

    let brainLocation: BrainLocation | undefined;
    if (meModelDetails.brainRegion) {
      brainLocation = {
        '@type': 'BrainLocation',
        brainRegion: {
          '@id': meModelDetails.brainRegion.id,
          label: meModelDetails.brainRegion.title,
        },
      };
    }

    // find annotations
    const mModelAnnotation = selectedMModel.annotation?.find((annotation) =>
      annotation['@type'].includes('MTypeAnnotation')
    );
    const eModelAnnotation = selectedEModel.annotation?.find((annotation) =>
      annotation['@type'].includes('ETypeAnnotation')
    );
    // add only non-undefined values
    const annotationList = [mModelAnnotation, eModelAnnotation].filter((ann) => ann !== undefined);
    const entity: EntityCreation<MEModel> = {
      '@type': ['Entity', 'MEModel'],
      '@context': 'https://bbp.neuroshapes.org',
      // these name and description will be filled properly when the user saves the me-model
      name: meModelDetails.name,
      description: meModelDetails.description,
      hasPart: [
        {
          '@type': 'EModel',
          '@id': selectedEModel['@id'],
          name: selectedEModel.name,
        },
        {
          '@type': 'NeuronMorphology',
          '@id': selectedMModel['@id'],
          name: selectedMModel.name,
        },
      ],
      annotation: annotationList,
      brainLocation,
      // 'image' will be added after me-model validation
      validated: false,
      status: 'initialized',
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
  async (get, _set, name, description) => {
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

export const initializeSummaryAtom = atom<
  null,
  [string, string | undefined, string | undefined],
  void
>(null, async (get, set, meModelId, org, project) => {
  const session = get(sessionAtom);

  if (!session) return;
  const meModel = await fetchResourceById<MEModelResource>(
    meModelId,
    session,
    meModelId.startsWith(nexus.defaultIdBaseUrl)
      ? {}
      : {
          org,
          project,
        }
  );

  const usedEModel = meModel.hasPart.find((r) => r['@type'] === 'EModel');
  const usedMModel = meModel.hasPart.find((r) => r['@type'] === 'NeuronMorphology');

  if (!usedEModel || !usedMModel) throw new Error('No EModel or Morphology found for ME-Model');

  set(selectedEModelIdAtom, usedEModel['@id']);
  set(selectedMModelIdAtom, usedMModel['@id']);
  set(meModelSelfUrlAtom, meModel._self);
});
