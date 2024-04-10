import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

import {
  getVirtualLabDetail,
  getVirtualLabProjects,
  getVirtualLabsOfUser,
} from '@/services/virtual-lab/labs';
import { Project, VirtualLab, VirtualLabAPIListData } from '@/types/virtual-lab/lab';

export const virtualLabDetailAtomFamily = atomFamily((virtualLabId: string) =>
  atom<Promise<VirtualLab>>(async () => {
    const response = await getVirtualLabDetail(virtualLabId);
    return response.data.virtual_lab;
  })
);

export const virtualLabProjectsAtomFamily = atomFamily((virtualLabId: string) =>
  atom<Promise<VirtualLabAPIListData<Project>>>(async () => {
    const response = await getVirtualLabProjects(virtualLabId);
    return response.data;
  })
);

export const virtualLabOfUserAtom = atom<Promise<VirtualLabAPIListData<VirtualLab>>>(async () => {
  const response = await getVirtualLabsOfUser();
  return response.data;
});

export const currentVirtualLabIdAtom = atom<string | null>(null);
