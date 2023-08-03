import { atom } from 'jotai';

import { EModel } from '@/types/e-model';

export const selectedEModelAtom = atom<EModel | null>(null);

export const eModelRemoteParamsLoadedAtom = atom(false);

export const refetchTriggerAtom = atom<{}>({});
