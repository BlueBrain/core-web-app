'use client';

import dynamic from 'next/dynamic';

const MacroConnectomeConfigurationView = dynamic(
  () => import('@/components/connectome-definition/macro/MacroConnectomeConfigView'),
  {
    ssr: false,
  }
);

export default function MacroConnectomeConfigurationPage() {
  return <MacroConnectomeConfigurationView />;
}
