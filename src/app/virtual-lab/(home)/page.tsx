import { redirect } from 'next/navigation';

import VirtualLabDashboard from '@/components/VirtualLab/VirtualLabDashboard';
import { getVirtualLabsOfUser } from '@/services/virtual-lab/labs';
import { auth } from '@/auth';

export default async function VirtualLabMainPage() {
  const session = await auth();
  if (!session) return;
  const virtualLabs = await getVirtualLabsOfUser(session.accessToken);
  if (virtualLabs.data.results.length === 0) {
    redirect('/virtual-lab/sandbox/home');
  }
  return <VirtualLabDashboard />;
}
