'use client';

import VirtualLabTeamTable from '@/components/VirtualLab/VirtualLabTeamTable';
import withVirtualLabUsers from '@/components/VirtualLab/data/WithVirtualLabUsers';
import { ServerSideComponentProp } from '@/types/common';

export default function VirtualLabProjectTeamPage({
  params,
}: ServerSideComponentProp<{ virtualLabId: string; projectId: string }>) {
  const { virtualLabId, projectId } = params;
  const WithVirtualLabProjectUsers = withVirtualLabUsers(
    VirtualLabTeamTable,
    virtualLabId,
    projectId
  );
  return <WithVirtualLabProjectUsers />;
}
