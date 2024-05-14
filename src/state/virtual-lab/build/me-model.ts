import { atom } from 'jotai';

import { MEModelMorphologyType, MEModelSection } from '@/types/virtual-lab/build/me-model';
import { ReconstructedNeuronMorphology } from '@/types/explore-section/es-experiment';

export const meModelSectionAtom = atom<MEModelSection>('morphology');

export const morphologyTypeAtom = atom<MEModelMorphologyType>('reconstructed');

export const selectedMModelAtom = atom<ReconstructedNeuronMorphology | null>(null);
