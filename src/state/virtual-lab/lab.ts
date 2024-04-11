import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

import { getVirtualLabDetail, getVirtualLabsOfUser } from '@/services/virtual-lab/labs';
import { VirtualLab, VirtualLabAPIListData } from '@/types/virtual-lab/lab';

export const virtualLabDetailAtomFamily = atomFamily((virtualLabId: string) =>
  atom<Promise<VirtualLab>>(async () => {
    const response = await getVirtualLabDetail(virtualLabId);
    return response.data.virtual_lab;
  })
);

export const virtualLabsOfUserAtom = atom<Promise<VirtualLabAPIListData<VirtualLab>>>(async () => {
  const response = await getVirtualLabsOfUser();
  return response.data;
});
