import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

import { Project } from '@/types/virtual-lab/projects';
import { VirtualLabAPIListData } from '@/types/virtual-lab/common';
import { getVirtualLabProjects } from '@/services/virtual-lab/projects';

export const virtualLabProjectsAtomFamily = atomFamily((virtualLabId: string) =>
  atom<Promise<VirtualLabAPIListData<Project>>>(async () => {
    const response = await getVirtualLabProjects(virtualLabId);

    return response.data;
  })
);
