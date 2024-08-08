import VirtualLabProjectHomePage from '@/components/VirtualLab/projects/VirtualLabProjectHomePage';
import { ServerSideComponentProp } from '@/types/common';

export default function VirtualLabProjectPage({
  params,
}: ServerSideComponentProp<{ virtualLabId: string; projectId: string }>) {
  const { virtualLabId, projectId } = params;
  return <VirtualLabProjectHomePage virtualLabId={virtualLabId} projectId={projectId} />;
}
