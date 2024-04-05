import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

import getVirtualLabDetail from '@/services/virtual-lab/labs';
import { VirtualLab } from '@/types/virtual-lab/lab';

export const virtualLabDetailAtomFamily = atomFamily((virtualLabId: string) =>
  atom<Promise<VirtualLab | null>>(() => {
    console.log(virtualLabId);
    return getVirtualLabDetail(virtualLabId);
  })
);
