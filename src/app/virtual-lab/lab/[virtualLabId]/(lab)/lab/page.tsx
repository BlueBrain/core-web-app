'use client';

import VirtualLabHomePage from '@/components/VirtualLab/VirtualLabHomePage';

interface ServerSideComponentProp<Params> {
  params: Params;
}

export default function VirtualLabSettingsPage({
  params,
}: ServerSideComponentProp<{ virtualLabId: string }>) {
  const { virtualLabId } = params;
  return <VirtualLabHomePage id="ba512c55-c579-4403-8075-7534a838912c" />;
}
