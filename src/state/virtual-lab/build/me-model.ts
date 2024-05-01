import { atom } from 'jotai';

import { MEModelMorphologyType, MEModelSection } from '@/types/virtual-lab/build/me-model';

export const meModelSectionAtom = atom<MEModelSection>('morphology');

export const morphologyTypeAtom = atom<MEModelMorphologyType>('reconstructed');
