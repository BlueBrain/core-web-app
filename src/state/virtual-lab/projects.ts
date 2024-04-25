import { atom } from 'jotai';
import { atomFamily, atomWithRefresh } from 'jotai/utils';
import isEqual from 'lodash/isEqual';

import { Project } from '@/types/virtual-lab/projects';
import { VirtualLabAPIListData } from '@/types/virtual-lab/common';
import {
  getUsersProjects,
  getVirtualLabProjectDetails,
  getVirtualLabProjectUsers,
  getVirtualLabProjects,
} from '@/services/virtual-lab/projects';
import { VirtualLabMember } from '@/types/virtual-lab/members';

export const virtualLabProjectsAtomFamily = atomFamily((virtualLabId: string) =>
  atomWithRefresh<Promise<VirtualLabAPIListData<Project>>>(async () => {
    const response = await getVirtualLabProjects(virtualLabId);

    return response.data;
  })
);

export const virtualLabProjectDetailsAtomFamily = atomFamily(
  ({ virtualLabId, projectId }: { virtualLabId: string; projectId: string }) =>
    atom<Promise<Project>>(async () => {
      const response = await getVirtualLabProjectDetails(virtualLabId, projectId);
      return response.data.project;
    }),
  isEqual
);

export const virtualLabProjectUsersAtomFamily = atomFamily(
  ({ virtualLabId, projectId }: { virtualLabId: string; projectId: string }) =>
    atom<Promise<VirtualLabMember[]>>(async () => {
      const response = await getVirtualLabProjectUsers(virtualLabId, projectId);
      return response.data.users;
    }),
  isEqual
);

export const userProjectsAtom = atom<Promise<VirtualLabAPIListData<Project>>>(async () => {
  const response = await getUsersProjects();
  return response.data;
});

export const userProjectsTotalAtom = atom<Promise<number>>(async (get) => {
  const projects = await get(userProjectsAtom);
  return projects.total;
});
