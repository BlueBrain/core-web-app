import VirtualLabTeamTable from '@/components/VirtualLab/VirtualLabTeamTable';
import { ServerSideComponentProp } from '@/types/common';

export default function VirtualLabTeamPage({
  params,
}: ServerSideComponentProp<{ virtualLabId: string }>) {
  const { virtualLabId } = params;
  return <VirtualLabTeamTable virtualLabId={virtualLabId} />;
}
