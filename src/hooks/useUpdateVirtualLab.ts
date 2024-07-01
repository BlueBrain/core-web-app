import { useCallback } from 'react';
import { useSetAtom } from 'jotai';
import { patchVirtualLab } from '@/services/virtual-lab/labs';
import { patchProject } from '@/services/virtual-lab/projects';
import { virtualLabDetailAtomFamily } from '@/state/virtual-lab/lab';
import { virtualLabProjectDetailsAtomFamily } from '@/state/virtual-lab/projects';
import { VirtualLab } from '@/types/virtual-lab/lab';

export default function useUpdateVirtualLab(id?: string) {
  const setVirtualLabDetail = useSetAtom(virtualLabDetailAtomFamily(id));

  return useCallback(
    (formData: Partial<VirtualLab>) =>
      patchVirtualLab(formData, id).then((responseJSON) => {
        const { data } = responseJSON;
        const { virtual_lab: virtualLab } = data;

        setVirtualLabDetail(
          new Promise((resolve) => {
            resolve(virtualLab);
          })
        );
      }),
    [id, setVirtualLabDetail]
  );
}

export function useUpdateProject(virtualLabId: string, projectId: string) {
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
