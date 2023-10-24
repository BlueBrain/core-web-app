'use client';

import { atom } from 'jotai';

export const extraPanelContainerAtom = atom<HTMLElement | null>(null);

export const toolBarAtom = atom<HTMLDivElement | null>(null);

// eslint-disable-next-line import/no-anonymous-default-export
export default {};
