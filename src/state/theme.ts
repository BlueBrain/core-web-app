'use client';

import { atom } from 'jotai/vanilla';

export type Theme = 'dark' | 'light';

export const themeAtom = atom<Theme>('light');
