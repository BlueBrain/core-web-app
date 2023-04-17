'use client';

import { atom } from 'jotai';

import { ExpDesignerConfig } from '@/types/experiment-designer';
import paramsDummyData from '@/components/experiment-designer/experiment-designer-dummy.json';

export const expDesignerConfigAtom = atom<ExpDesignerConfig>(paramsDummyData as ExpDesignerConfig);

export const asyncExpDesignerConfigAtom = atom<
  Promise<ExpDesignerConfig>,
  [((prevConfig: ExpDesignerConfig) => ExpDesignerConfig) | ExpDesignerConfig],
  void
>(
  (get) => {
    const expDesConfig = get(expDesignerConfigAtom);
    return Promise.resolve(expDesConfig);
  },
  (get, set, config) => {
    set(expDesignerConfigAtom, config);
  }
);

export default expDesignerConfigAtom;
