import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import VirtualLabDashboard from '@/components/VirtualLab/VirtualLabDashboard';
import { getVirtualLabsOfUser } from '@/services/virtual-lab/labs';

export default async function VirtualLabMainPage() {
  let redirectPath: string | null = null;
  let toRender: ReactNode = null;
  try {
    const virtualLabs = await getVirtualLabsOfUser();
    if (!virtualLabs.data.results || virtualLabs.data.results.length === 0) {
      redirectPath = '/virtual-lab/sandbox/home';
    }

    toRender = <VirtualLabDashboard virtualLabs={virtualLabs.data.results} />;
  } catch (error) {
    toRender = <div>An error occurred while loading the dashboard.</div>;
  } finally {
    if (redirectPath) {
      redirect(redirectPath);
    }
  }
  return toRender;
}
