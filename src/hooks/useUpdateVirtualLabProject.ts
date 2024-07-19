import { useCallback } from 'react';
import { useSetAtom } from 'jotai';

import { patchProject } from '@/services/virtual-lab/projects';
import { virtualLabProjectDetailsAtomFamily } from '@/state/virtual-lab/projects';
import { VirtualLab } from '@/types/virtual-lab/lab';

export default function useUpdateProject(virtualLabId: string, projectId: string) {
  const setProjectDetails = useSetAtom(
    virtualLabProjectDetailsAtomFamily({ virtualLabId, projectId })
  );

  return useCallback(
    (formData: Partial<VirtualLab>) =>
      patchProject(formData, virtualLabId, projectId).then((responseJSON) => {
        const { data } = responseJSON;
        const { project } = data;

        setProjectDetails(
          new Promise((resolve) => {
            resolve(project);
          })
        );
      }),
    [projectId, virtualLabId, setProjectDetails]
  );
}
