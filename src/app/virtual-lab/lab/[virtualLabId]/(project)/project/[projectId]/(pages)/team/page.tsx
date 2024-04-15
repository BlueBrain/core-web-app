import VirtualLabTeamTable from '@/components/VirtualLab/VirtualLabTeamTable';
import { ServerSideComponentProp } from '@/types/common';

export default function VirtualLabProjectTeamPage({
  params,
}: ServerSideComponentProp<{ virtualLabId: string; projectId: string }>) {
  const { virtualLabId, projectId } = params;
  return <VirtualLabTeamTable virtualLabId="to-be-replaced-by-actual-id" />;
}
