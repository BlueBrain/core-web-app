import { atom } from 'jotai';
import { ApplicationSection } from '@/types/common';

export const sectionAtom = atom<ApplicationSection | null>(null);
