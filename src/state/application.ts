import { atom } from 'jotai';
import { ApplicationSection, LoadingDefaultValuesType } from '@/types/common';

export const sectionAtom = atom<ApplicationSection | null>(null);

export const loadingDefaultValuesAtom = atom<LoadingDefaultValuesType>({
  brainRegionSelector: true,
  eModelSelector: true,
  mModelSelector: true,
  meModelSelector: true,
});
