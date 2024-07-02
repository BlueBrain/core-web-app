import VirtualLabDetail from './VirtualLabDetail';
import { getVirtualLabDetail } from '@/services/virtual-lab/labs';

export default async function VirtualLabDetailServer({ id }: { id: string }) {
  const data = (await getVirtualLabDetail(id)).data.virtual_lab;
  return <VirtualLabDetail lab={data} />;
}
