import VirtualLabSidebarContent, { VirtualLabSidebarTitle } from './VirtualLabSidebar';
import { getVirtualLabDetail } from '@/services/virtual-lab/labs';

export async function VirtualLabSidebar({ virtualLabId }: { virtualLabId: string }) {
  const vlab = (await getVirtualLabDetail(virtualLabId)).data.virtual_lab;
  return (
    <div className="mr-5 flex w-full flex-col gap-5">
      <VirtualLabSidebarContent initialVlab={vlab} />
    </div>
  );
}

export default async function VirtualLabSidebarWithTitle({
  virtualLabId,
}: {
  virtualLabId: string;
}) {
  const vlab = (await getVirtualLabDetail(virtualLabId)).data.virtual_lab;
  return (
    <div className="mr-5 flex w-full flex-col gap-5">
      <VirtualLabSidebarTitle name={vlab.name} />
      <VirtualLabSidebarContent initialVlab={vlab} />
    </div>
  );
}
