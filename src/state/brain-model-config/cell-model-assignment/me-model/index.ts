import { atom } from 'jotai';

import { MEFeatureWithEModel } from '@/types/me-model';

export const refetchTriggerAtom = atom<{}>({});

export const featureWithEModelAtom = atom<MEFeatureWithEModel | null>(null);
