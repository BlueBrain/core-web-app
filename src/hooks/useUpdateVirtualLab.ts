import { useCallback } from 'react';
import { useSetAtom } from 'jotai';

import { patchVirtualLab } from '@/services/virtual-lab/labs';
import { virtualLabDetailAtomFamily } from '@/state/virtual-lab/lab';
import { VirtualLab } from '@/types/virtual-lab/lab';

export default function useUpdateVirtualLab(id?: string) {
  const setVirtualLabDetail = useSetAtom(virtualLabDetailAtomFamily(id));

  return useCallback(
    async (formData: Partial<VirtualLab>) => {
      if (!id) return;
      patchVirtualLab(formData, id).then((responseJSON) => {
        const { data } = responseJSON;
        const { virtual_lab: virtualLab } = data;

        setVirtualLabDetail(
          new Promise((resolve) => {
            resolve(virtualLab);
          })
        );
      });
    },
    [id, setVirtualLabDetail]
  );
}
