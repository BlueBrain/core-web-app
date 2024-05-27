'use client';

import VirtualLabSettingsComponent from '@/components/VirtualLab/VirtualLabSettingsComponent';
import { useAccessToken } from '@/hooks/useAccessToken';
import { ServerSideComponentProp } from '@/types/common';

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
