import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import isEqual from 'lodash/isEqual';

import { Project } from '@/types/virtual-lab/projects';
import { VirtualLabAPIListData } from '@/types/virtual-lab/common';
import {
  getVirtualLabProjectDetails,
  getVirtualLabProjectUsers,
  getVirtualLabProjects,
} from '@/services/virtual-lab/projects';
import { VirtualLabMember } from '@/types/virtual-lab/members';

export const virtualLabProjectsAtomFamily = atomFamily((virtualLabId: string) =>
  atom<Promise<VirtualLabAPIListData<Project>>>(async () => {
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
