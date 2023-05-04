import { atom } from 'jotai';
import { OriginalComposition } from '@/types/composition/original';

export const compositionHistoryAtom = atom<OriginalComposition[]>([]);
export const compositionHistoryIndexAtom = atom<number>(0);
