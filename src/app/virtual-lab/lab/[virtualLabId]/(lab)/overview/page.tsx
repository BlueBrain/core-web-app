'use client';

import VirtualLabHomePage from '@/components/VirtualLab/VirtualLabHomePage';
import { ServerSideComponentProp } from '@/types/common';

export default function VirtualLabSettingsPage({
  params,
}: ServerSideComponentProp<{ virtualLabId: string }>) {
  const { virtualLabId } = params;
  return <VirtualLabHomePage id={virtualLabId} />;
}
