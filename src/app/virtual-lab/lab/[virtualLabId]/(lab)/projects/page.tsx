import VirtualLabProjectList from '@/components/VirtualLab/projects/VirtualLabProjectList';

interface ServerSideComponentProp<Params> {
  params: Params;
}

export default function VirtualLabProjectsPage({
  params,
}: ServerSideComponentProp<{ virtualLabId: string }>) {
  const { virtualLabId } = params;

  return <VirtualLabProjectList id={virtualLabId} />;
}
