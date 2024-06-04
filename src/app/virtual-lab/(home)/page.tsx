import { redirect } from 'next/navigation';

import VirtualLabDashboard from '@/components/VirtualLab/VirtualLabDashboard';
import { getVirtualLabsOfUser } from '@/services/virtual-lab/labs';
import { useAuthenticatedRoute } from '@/hooks/server-safe-hooks';

export default async function VirtualLabMainPage() {
  await useAuthenticatedRoute()
  const virtualLabs = await getVirtualLabsOfUser();
  if (virtualLabs.data.results.length === 0) {
    redirect('/virtual-lab/sandbox/home');
  }
  return <VirtualLabDashboard virtualLabs={virtualLabs.data.results} />;
}
