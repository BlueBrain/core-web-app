'use client';

import VirtualLabTeamTable from '@/components/VirtualLab/VirtualLabTeamTable';
import withVirtualLabUsers from '@/components/VirtualLab/data/WithVirtualLabUsers';
import { ServerSideComponentProp } from '@/types/common';

export default function VirtualLabTeamPage({
  params,
}: ServerSideComponentProp<{ virtualLabId: string }>) {
  const { virtualLabId } = params;
  const WithVirtualLabUsers = withVirtualLabUsers(VirtualLabTeamTable, virtualLabId);
  return <WithVirtualLabUsers />;
}
