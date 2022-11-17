import dynamic from 'next/dynamic';

const SidebarGroup = dynamic(() => import('./Sidebar'), { ssr: false });

export default function BrainFactory() {
  return <SidebarGroup />;
}
