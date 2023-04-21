'use client';

import { useEffect, Suspense } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { createNexusClient } from '@bbp/nexus-sdk';
import { useSession } from 'next-auth/react';
import { format, parseISO } from 'date-fns';
import find from 'lodash/find';
import usePathname from '@/hooks/pathname';
import { nexus as nexusConfig } from '@/config';
import Sidebar from '@/components/explore-section/Sidebar';
import EphysViewerContainer from '@/components/explore-section/EphysViewerContainer';
import { AnnotationEntity, DeltaResource, SideLink } from '@/types/explore-section';
import { setInfoWithPath } from '@/util/explore-section/detail-view';
import createDetailAtoms from '@/state/explore-section/detail-atoms-constructor';
import ExploreSectionDetailField from '@/components/explore-section/ExploreSectionDetailField';
import DetailHeaderName from '@/components/explore-section/DetailHeaderName';

const { infoAtom, detailAtom } = createDetailAtoms();

function EphysDetailHeader({ detail }: { detail: DeltaResource | null }) {
  if (!detail) return <>Not Found</>;

  const getEtype = (x: DeltaResource): string => {
    const entity = find(x.annotation, (o: AnnotationEntity) => o.name === 'E-type Annotation');
    return entity ? entity.hasBody.label : 'no EType';
  };

  return (
    <div className="w-1/2">
      <DetailHeaderName detail={detail} />
      <div className="grid grid-cols-3 grid-rows-3 gap-4 mt-10">
        <ExploreSectionDetailField
          title="Description"
          field={detail?.description}
          className={['col-span-2', 'row-span-2']}
        />
        <ExploreSectionDetailField title="E-Type" field={getEtype(detail)} />
        <ExploreSectionDetailField
          title="Brain Location"
          field={detail?.brainLocation?.brainRegion?.label}
        />
        <ExploreSectionDetailField
          title="Contributor"
          field={detail?._createdBy?.split('/')?.pop()}
        />
        <ExploreSectionDetailField
          title="Added"
          field={
            detail?._createdAt && (
              <div className="mt-3">{format(parseISO(detail?._createdAt), 'dd.MM.yyyy')}</div>
            )
          }
        />
      </div>
    </div>
  );
}

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
        <EphysDetailHeader detail={detail} />
        {detail && session && <EphysViewerContainer resource={detail} nexus={nexus} />}
      </div>
    </div>
  );
}

export default function EphysDetailPage() {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <EphysDetail />
    </Suspense>
  );
}
