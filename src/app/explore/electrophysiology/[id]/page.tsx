'use client';

import { useEffect, Suspense } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { createNexusClient } from '@bbp/nexus-sdk';
import { useSession } from 'next-auth/react';
import usePathname from '@/hooks/pathname';
import { nexus as nexusConfig } from '@/config';
import DetailHeader from '@/components/explore-section/DetailHeader';
import Sidebar from '@/components/explore-section/Sidebar';
import EphysViewerContainer from '@/components/explore-section/ephys/EphysViewerContainer';
import { SideLink } from '@/types/explore-section';
import { setInfoWithPath } from '@/util/explore-section/detail-view';
import createDetailAtoms from '@/state/explore-section/detail-atoms-constructor';

const { infoAtom, detailAtom } = createDetailAtoms();

function EphysDetail() {
  const { data: session } = useSession();
  const nexus = createNexusClient({ uri: nexusConfig.url, token: session?.accessToken });
  const path = usePathname();

  const detail = useAtomValue(detailAtom);

  const setInfo = useSetAtom(infoAtom);

  useEffect(() => setInfoWithPath(path, setInfo), [path, setInfo]);

  const links: Array<SideLink> = [
    { url: '/explore/electrophysiology', title: 'Neuron Electrophysiology' },
  ];

  return (
    <div className="flex h-screen" style={{ background: '#d1d1d1' }}>
      <Sidebar links={links} />
      <div className="bg-white w-full h-full overflow-scroll flex flex-col p-7 pr-12 gap-7">
        <DetailHeader detail={detail} />
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
