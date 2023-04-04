'use client';

import { atom } from 'jotai';

import { BrainRegion } from '@/types/ontologies';
import { ExpDesignerConfig } from '@/types/experiment-designer';
import paramsDummyData from '@/components/experiment-designer/experiment-designer-dummy.json';

export const expDesignerConfigAtom = atom<Promise<ExpDesignerConfig>>(
  async () =>
    // TODO: fetch from nexus config
    paramsDummyData as ExpDesignerConfig
);

export const expDesignerSimulateRegions = atom<BrainRegion | BrainRegion[] | null>(null);

export default expDesignerConfigAtom;
