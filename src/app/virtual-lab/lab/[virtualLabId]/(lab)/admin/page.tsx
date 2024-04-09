import VirtualLabSettingsComponent from '@/components/VirtualLab/VirtualLabSettingsComponent';

interface ServerSideComponentProp<Params> {
  params: Params;
}

export default function VirtualLabAdminPage({
  params,
}: ServerSideComponentProp<{ virtualLabId: string }>) {
  const { virtualLabId } = params;

  return <VirtualLabSettingsComponent id={virtualLabId} />;
}
