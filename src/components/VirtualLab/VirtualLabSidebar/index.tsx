import VirtualLabSidebarContent from './VirtualLabSidebar';
import { getVirtualLabDetail } from '@/services/virtual-lab/labs';

export default async function VirtualLabSidebar({
  virtualLabId,
  showTitle = false,
}: {
  virtualLabId: string;
  showTitle?: boolean;
}) {
  const vlab = (await getVirtualLabDetail(virtualLabId)).data.virtual_lab;
  return (
    <div className="mr-5 flex w-full flex-col gap-5">
      <VirtualLabSidebarContent initialVlab={vlab} showTitle={showTitle} />
    </div>
  );
}
