import { atom } from 'jotai';
import { Composition } from '@/types/composition';

export const compositionHistoryAtom = atom<Composition[]>([]);
export const compositionHistoryIndexAtom = atom<number>(0);
