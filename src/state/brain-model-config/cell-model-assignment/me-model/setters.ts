import { atom } from 'jotai';

import { refetchTriggerAtom } from '.';

export const triggerRefetchAtom = atom(null, (get, set) => set(refetchTriggerAtom, {}));
