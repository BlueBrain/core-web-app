import { RefObject } from 'react';
import { PrimitiveAtom, atom } from 'jotai';
import { atomFamily, atomWithDefault } from 'jotai/utils';

import {
  getVirtualLabDetail,
  getVirtualLabUsers,
  getVirtualLabsOfUser,
  getPlans,
} from '@/services/virtual-lab/labs';
import { VirtualLab } from '@/types/virtual-lab/lab';
import { VirtualLabAPIListData } from '@/types/virtual-lab/common';
import { VirtualLabMember } from '@/types/virtual-lab/members';

export const virtualLabDetailAtomFamily = atomFamily<string, PrimitiveAtom<Promise<VirtualLab>>>(
  (virtualLabId) =>
    atomWithDefault(async () => {
      const response = await getVirtualLabDetail(virtualLabId);

      return response.data.virtual_lab;
    })
);

export const virtualLabMembersAtomFamily = atomFamily((virtualLabId: string) =>
  atom<Promise<VirtualLabMember[]>>(async () => {
    const response = await getVirtualLabUsers(virtualLabId);
    return response.data.users;
  })
);

export const virtualLabsOfUserAtom = atom<Promise<VirtualLabAPIListData<VirtualLab>>>(async () => {
  const response = await getVirtualLabsOfUser();
  return response.data;
});

export const projectTopMenuRefAtom = atom<RefObject<HTMLDivElement> | null>(null);

export const userVirtualLabTotalsAtom = atom<Promise<number>>(async (get) => {
  const virtualLabs = await get(virtualLabsOfUserAtom);
  return virtualLabs.total;
});

export const virtualLabPlansAtom = atom<
  Promise<
    Array<{
      id: number;
      name: string;
      price: number;
      features: Record<string, Array<string>>;
    }>
  >
>(async () => {
  const { data } = await getPlans();
  const { all_plans: allPlans } = data;

  return allPlans;
});
