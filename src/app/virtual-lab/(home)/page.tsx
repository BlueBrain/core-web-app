import { redirect } from 'next/navigation';

import VirtualLabDashboard from '@/components/VirtualLab/VirtualLabDashboard';
import { getVirtualLabsOfUser } from '@/services/virtual-lab/labs';

export default async function VirtualLabMainPage() {
  try {
    const virtualLabs = await getVirtualLabsOfUser();

    if (!virtualLabs?.data?.results || virtualLabs.data.results.length === 0) {
      redirect('/virtual-lab/sandbox/home');
    }

    return <VirtualLabDashboard virtualLabs={virtualLabs.data.results} />;
  } catch (error) {
    return <div>An error occurred while loading the dashboard.</div>;
  }
}
