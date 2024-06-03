import { Suspense } from 'react';
import VirtualLabHomePage from '@/components/VirtualLab/VirtualLabHomePage';
import { ServerSideComponentProp } from '@/types/common';

export default function VirtualLabSettingsPage({
  params,
}: ServerSideComponentProp<{ virtualLabId: string }>) {
  const { virtualLabId } = params;
  return (
    <Suspense fallback={<VirtualLabHomePage />}>
      <VirtualLabHomePage id={virtualLabId} />
    </Suspense>
  );
}
