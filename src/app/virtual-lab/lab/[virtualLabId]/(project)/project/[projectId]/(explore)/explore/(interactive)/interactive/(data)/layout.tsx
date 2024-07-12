'use client';

import { ReactNode } from 'react';
import ExploreListingLayout from '@/components/explore-section/ExploreListingLayout';
import { VirtualLabInfo } from '@/types/virtual-lab/common';

export default function VirtualLabExperimentLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { virtualLabId: string; projectId: string };
}) {
  const virtualLabInfo: VirtualLabInfo = {
    virtualLabId: params.virtualLabId,
    projectId: params.projectId,
  };
  return <ExploreListingLayout virtualLabInfo={virtualLabInfo}>{children}</ExploreListingLayout>;
}
