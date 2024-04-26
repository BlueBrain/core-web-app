'use client';

import VirtualLabSettingsComponent from '@/components/VirtualLab/VirtualLabSettingsComponent';
import { ServerSideComponentProp } from '@/types/common';
import { useAccessToken } from '@/components/experiment-interactive/ExperimentInteractive/hooks/current-campaign-descriptor';

export default function VirtualLabAdminPage({
  params,
}: ServerSideComponentProp<{ virtualLabId: string }>) {
  const { virtualLabId } = params;
  const token = useAccessToken();

  if (token) {
    return <VirtualLabSettingsComponent id={virtualLabId} token={token} />;
  }
  return null;
}
