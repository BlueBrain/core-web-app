'use client';

import dynamic from 'next/dynamic';

import useLiteratureCleanNavigate from '@/components/explore-section/Literature/useLiteratureCleanNavigate';

const MacroConnectomeConfigurationView = dynamic(
  () => import('@/components/connectome-definition/macro/MacroConnectomeConfigView'),
  {
    ssr: false,
  }
);

export default function MacroConnectomeConfigurationPage() {
  useLiteratureCleanNavigate();
  return <MacroConnectomeConfigurationView />;
}
