'use client';

import { useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { useSetAtom, useAtomValue } from 'jotai';
import { createNexusClient } from '@bbp/nexus-sdk';
import { nexus as nexusConfig } from '@/config';
import { detailAtom, infoAtom } from '@/state/ephys/detail';
import DetailHeader from '@/components/observatory/ephys/DetailHeader';
import Sidebar from '@/components/observatory/Sidebar';
import EphysViewerContainer from '@/components/observatory/ephys/EphysViewerContainer';
import { from64 } from '@/util/common';
import { SideLink } from '@/types/observatory';

function EphysDetail() {
  const nexus = createNexusClient({ uri: nexusConfig.url });
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

  const links: Array<SideLink> = [{ url: '/electrophysiology', title: 'Neuron Electrophysiology' }];

  return (
    <div className="flex h-screen" style={{ background: '#d1d1d1' }}>
      <Sidebar links={links} />
      <div className="w-full h-full flex flex-col">
        <DetailHeader />
        <div className="w-full h-full flex-1 bg-white p-4">
          <h1 className="text-xl font-bold mt-4 text-primary-7">
            APWaveforms <span className="font-thin text-sm">5 repetitions</span>
          </h1>
          <hr className="h-px my-8 bg-neutral-2 border-0" />
          <div className="flex pt-4">
            {detail && <EphysViewerContainer resource={detail} nexus={nexus} />}
          </div>
        </div>
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
