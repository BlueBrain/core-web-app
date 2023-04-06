'use client';

import { useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { useSetAtom, useAtomValue } from 'jotai';
import { createNexusClient } from '@bbp/nexus-sdk';
import { useSession } from 'next-auth/react';
import { nexus as nexusConfig } from '@/config';
import { detailAtom, infoAtom } from '@/state/explore-section/ephys/detail';
import DetailHeader from '@/components/explore-section/ephys/DetailHeader';
import Sidebar from '@/components/explore-section/Sidebar';
import EphysViewerContainer from '@/components/explore-section/ephys/EphysViewerContainer';
import { from64 } from '@/util/common';
import { SideLink } from '@/types/explore-section';

function EphysDetail() {
  const { data: session } = useSession();
  const nexus = createNexusClient({ uri: nexusConfig.url, token: session?.accessToken });
  const path = usePathname();

  const detail = useAtomValue(detailAtom);

  const parts = path?.split('/');

  const setInfo = useSetAtom(infoAtom);

  useEffect(() => {
    if (parts === undefined) return;
    const key = from64(parts[parts.length - 1]);
    const info = key.split('!/!');
    const orgProj = info[0].split('/');
    setInfo({
      id: info[info.length - 1],
      org: orgProj[0],
      project: orgProj[1],
    });
  }, []);

  const links: Array<SideLink> = [
    { url: '/explore/electrophysiology', title: 'Neuron Electrophysiology' },
  ];

  return (
    <div className="flex h-screen" style={{ background: '#d1d1d1' }}>
      <Sidebar links={links} />
      <div className="bg-white w-full h-full overflow-scroll flex flex-col p-7 pr-12 gap-7">
        <DetailHeader />
        {detail && session && <EphysViewerContainer resource={detail} nexus={nexus} />}
      </div>
    </div>
  );
}

function EphysDetailPage() {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <EphysDetail />
    </Suspense>
  );
}

export default EphysDetailPage;
