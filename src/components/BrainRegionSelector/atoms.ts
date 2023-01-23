import { atom } from 'jotai/vanilla';
import { Composition, CompositionNodesAndLinks, MeTypeDetailsState } from './types';
import { setConfigurationAtom } from '@/state/brain-model-config/cell-composition';
import { switchStateType } from '@/util/common';

export const meTypeDetailsAtom = atom<MeTypeDetailsState | null>(null);

export const compositionAtom = atom<CompositionNodesAndLinks, CompositionNodesAndLinks[], void>(
  { links: [], nodes: [] },
  async (get, set, newComposition) => {
    const meTypeDetails = get(meTypeDetailsAtom);
    if (meTypeDetails === null) {
      return;
    }
    const entityId = meTypeDetails.id;
    const newConfig = {
      compositionDetails: newComposition,
    };
    await set(compositionAtom, newComposition);
    await set(setConfigurationAtom, { entityId, config: newConfig });
  }
);

export const densityOrCountAtom = atom<keyof Composition>(
  switchStateType.COUNT as keyof Composition
);
