'use client';

import VirtualLabSidebarContent, { VirtualLabSidebarTitle } from './VirtualLabSidebar';
import { useLoadableValue } from '@/hooks/hooks';
import { virtualLabDetailAtomFamily } from '@/state/virtual-lab/lab';

export default function VirtualLabSidebarWithTitle({ virtualLabId }: { virtualLabId: string }) {
  const virtualLabDetail = useLoadableValue(virtualLabDetailAtomFamily(virtualLabId));

  if (virtualLabDetail.state === 'hasData' && !!virtualLabDetail.data) {
    return (
      <div className="mr-5 flex w-full flex-col gap-5">
        <VirtualLabSidebarTitle name={virtualLabDetail.data.name} />
        <VirtualLabSidebarContent initialVlab={virtualLabDetail.data} />
      </div>
    );
  }
}
