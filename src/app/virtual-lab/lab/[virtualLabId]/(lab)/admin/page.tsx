'use client';

import { useSession } from 'next-auth/react';

import VirtualLabSettingsComponent from '@/components/VirtualLab/VirtualLabSettingsComponent';
import { ServerSideComponentProp } from '@/types/common';

export default function VirtualLabAdminPage({
  params,
}: ServerSideComponentProp<{ virtualLabId: string }>) {
  const { virtualLabId } = params;
  const session = useSession();

  if (session.data) {
    return <VirtualLabSettingsComponent id={virtualLabId} token={session.data.accessToken} />;
  }
  return null;
}
