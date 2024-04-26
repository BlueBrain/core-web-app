'use client';

import VirtualLabProjectList from '@/components/VirtualLab/projects/VirtualLabProjectList';
import { ServerSideComponentProp } from '@/types/common';

export default function VirtualLabProjectsPage({
  params,
}: ServerSideComponentProp<{ virtualLabId: string }>) {
  const { virtualLabId } = params;

  return <VirtualLabProjectList id={virtualLabId} />;
}
