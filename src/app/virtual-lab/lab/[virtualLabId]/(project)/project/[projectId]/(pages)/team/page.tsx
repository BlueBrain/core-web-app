'use client';

import VirtualLabTeamTable from '@/components/VirtualLab/VirtualLabTeamTable';
import withVirtualLabProjectUsers from '@/components/VirtualLab/data/WithVirtualLabProjectUsers';
import { ServerSideComponentProp } from '@/types/common';

export default function VirtualLabProjectTeamPage({
  params,
}: ServerSideComponentProp<{ virtualLabId: string; projectId: string }>) {
  const { virtualLabId, projectId } = params;
  const WithVirtualLabProjectUsers = withVirtualLabProjectUsers(
    VirtualLabTeamTable,
    virtualLabId,
    projectId
  );
  return <WithVirtualLabProjectUsers />;
}
