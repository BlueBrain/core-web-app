'use client';

import dynamic from 'next/dynamic';

import useLiteratureCleanNavigate from '@/components/explore-section/Literature/useLiteratureCleanNavigate';

const MicroConnectomeConfigurationView = dynamic(
  () => import('@/components/connectome-definition/micro/MicroConnectomeConfigView'),
  {
    ssr: false,
  }
);

export default function MicroConnectomeConfigurationPage() {
  useLiteratureCleanNavigate();

  return <MicroConnectomeConfigurationView />;
}
