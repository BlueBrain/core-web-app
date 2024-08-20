import { useCallback } from 'react';
import { patchVirtualLab } from '@/services/virtual-lab/labs';
import { VirtualLab } from '@/types/virtual-lab/lab';
import { useAtom } from '@/state/state';

export default function useUpdateVirtualLab(id?: string) {
  const [, setVirtualLabDetail] = useAtom(id ?? '');

  return useCallback(
    async (formData: Partial<VirtualLab>) => {
      if (!id) return;
      patchVirtualLab(formData, id).then((responseJSON) => {
        const { data } = responseJSON;
        const { virtual_lab: virtualLab } = data;
        setVirtualLabDetail(virtualLab);
      });
    },
    [id, setVirtualLabDetail]
  );
}
