import { atom } from 'jotai';

export interface NodeSetsPalette {
  [key: string]: string;
}

export const nodeSetsPaletteAtom = atom<NodeSetsPalette>({});
