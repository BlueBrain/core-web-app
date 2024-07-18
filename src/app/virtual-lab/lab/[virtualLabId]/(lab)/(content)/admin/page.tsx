'use client';

import VirtualLabSettingsComponent from '@/components/VirtualLab/VirtualLabSettingsComponent';
import { ServerSideComponentProp } from '@/types/common';

export default function VirtualLabAdminPage({
  params,
}: ServerSideComponentProp<{ virtualLabId: string }>) {
  const { virtualLabId } = params;

  return <VirtualLabSettingsComponent id={virtualLabId} />;
}
