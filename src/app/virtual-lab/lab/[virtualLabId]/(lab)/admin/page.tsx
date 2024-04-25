import { useAtomValue } from 'jotai';

import VirtualLabSettingsComponent from '@/components/VirtualLab/VirtualLabSettingsComponent';
import sessionAtom from '@/state/session';
import { ServerSideComponentProp } from '@/types/common';

export default function VirtualLabAdminPage({
  params,
}: ServerSideComponentProp<{ virtualLabId: string }>) {
  const { virtualLabId } = params;
  const session = useAtomValue(sessionAtom);

  if (session) {
    return <VirtualLabSettingsComponent id={virtualLabId} token={session.accessToken} />;
  }
  return null;
}
