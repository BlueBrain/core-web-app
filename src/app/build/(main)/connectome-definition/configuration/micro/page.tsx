'use client';

import dynamic from 'next/dynamic';

const MicroConnectomeConfigurationView = dynamic(
  () => import('@/components/connectome-definition/micro/MicroConnectomeConfigView'),
  {
    ssr: false,
  }
);

export default function MicroConnectomeConfigurationPage() {
  return <MicroConnectomeConfigurationView />;
}
