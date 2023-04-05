'use client';

import { atom } from 'jotai';

import { BrainRegion } from '@/types/ontologies';
import { ExpDesignerConfig } from '@/types/experiment-designer';
import paramsDummyData from '@/components/experiment-designer/experiment-designer-dummy.json';

const expDesignerConfigAtom = atom<ExpDesignerConfig>(paramsDummyData as ExpDesignerConfig);

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

export const expDesignerSimulateRegions = atom<BrainRegion | BrainRegion[] | null>(null);

export default expDesignerConfigAtom;
