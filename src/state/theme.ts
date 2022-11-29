import { atom } from 'jotai';

export type Theme = 'dark' | 'light';

export const themeAtom = atom<Theme>('light');
