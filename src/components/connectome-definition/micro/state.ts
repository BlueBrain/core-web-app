import { atom } from 'jotai';
import { loadable } from 'jotai/utils';

import { createVariantColorMap } from './utils';
import { configPayloadAtom } from '@/state/brain-model-config/micro-connectome';

export const variantNamesAtom = atom<Promise<string[]>>(async (get) => {
  const configPayload = await get(configPayloadAtom);

  return Object.keys(configPayload?.variants ?? {}).sort();
});

export const variantNamesLoadableAtom = loadable(variantNamesAtom);

export const variantColorMapAtom = atom<Promise<Map<string, string>>>(async (get) => {
  const variantNames = await get(variantNamesAtom);

  return createVariantColorMap(variantNames);
});

export const variantColorMapLoadableAtom = loadable(variantColorMapAtom);
