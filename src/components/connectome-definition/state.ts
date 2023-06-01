import { atom } from 'jotai';

export const editNameAtom = atom('');
export const offsetAtom = atom(0);
export const multiplierAtom = atom(1);
export const currentEditIdxAtom = atom<number | null>(null);
