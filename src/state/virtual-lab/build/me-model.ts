import { atom } from 'jotai';

import { MEModelMorphologyType, MEModelSection } from '@/types/virtual-lab/build/me-model';
import { EModel, NeuronMorphology } from '@/types/e-model';
import sessionAtom from '@/state/session';
import { fetchResourceById } from '@/api/nexus';
import { MEModelResource } from '@/types/me-model';
import { getIdFromSelfUrl } from '@/util/nexus';

export const meModelSectionAtom = atom<MEModelSection>('morphology');

export const morphologyTypeAtom = atom<MEModelMorphologyType>('reconstructed');

export const selectedMModelIdAtom = atom<string | null>(null);

export const selectedEModelIdAtom = atom<string | null>(null);

export const selectedMModelAtom = atom<Promise<NeuronMorphology | undefined>>(async (get) => {
  const session = get(sessionAtom);
  const mModelId = get(selectedMModelIdAtom);
  if (!session || !mModelId) return;

  return fetchResourceById<NeuronMorphology>(mModelId, session);
});

export const selectedEModelAtom = atom<Promise<EModel | undefined>>(async (get) => {
  const session = get(sessionAtom);
  const eModelId = get(selectedEModelIdAtom);
  if (!session || !eModelId) return;

  return fetchResourceById<EModel>(eModelId, session);
});

export const meModelSelfUrlAtom = atom<string | null>(null);

export const selectedMEModelIdAtom = atom<string | null>((get) => {
  const meModelSelfUrl = get(meModelSelfUrlAtom);
  return getIdFromSelfUrl(meModelSelfUrl);
});

export const meModelResourceAtom = atom<Promise<MEModelResource | undefined>>(async (get) => {
  const session = get(sessionAtom);
  const meModelId = get(selectedMEModelIdAtom);
  if (!session || !meModelId) return;

  return fetchResourceById<MEModelResource>(meModelId, session);
});
