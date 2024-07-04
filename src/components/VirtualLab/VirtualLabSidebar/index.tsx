import VirtualLabSidebarPage from './VirtualLabSidebar';
import { getVirtualLabDetail } from '@/services/virtual-lab/labs';

export default async function VirtualLabSidebar({ virtualLabId }: { virtualLabId: string }) {
  const vlab = (await getVirtualLabDetail(virtualLabId)).data.virtual_lab;
  return <VirtualLabSidebarPage initialVlab={vlab} />;
}
