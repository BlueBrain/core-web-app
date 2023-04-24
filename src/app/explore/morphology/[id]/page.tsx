'use client';

import { Suspense, useEffect } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { createNexusClient } from '@bbp/nexus-sdk';
import { useSession } from 'next-auth/react';
import { format, parseISO } from 'date-fns';
import find from 'lodash/find';
import { useSearchParams } from 'next/navigation';
import Error from 'next/error';
import { loadable } from 'jotai/utils';
import usePathname from '@/hooks/pathname';
import { nexus as nexusConfig } from '@/config';
import Sidebar from '@/components/explore-section/Sidebar';
import { AnnotationEntity, DeltaResource, SideLink } from '@/types/explore-section';
import { setInfoWithPath } from '@/util/explore-section/detail-view';
import createDetailAtoms from '@/state/explore-section/detail-atoms-constructor';
import ExploreSectionDetailField from '@/components/explore-section/ExploreSectionDetailField';
import DetailHeaderName from '@/components/explore-section/DetailHeaderName';
import MorphoViewerContainer from '@/components/explore-section/MorphoViewerContainer';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';

const { infoAtom, detailAtom, latestRevisionAtom } = createDetailAtoms();

function MorphologyDetailHeader({
  detail,
  url,
  latestRevision,
}: {
  detail: DeltaResource;
  url?: string | null;
  latestRevision: number | null;
}) {
  if (!detail) return <>Not Found</>;

  const getMtype = (x: DeltaResource) => {
    const entity = find(x.annotation, (o: AnnotationEntity) => o.name === 'M-type Annotation');
    return entity ? entity.hasBody.label : 'no MType';
  };
  return (
    <div className="w-2/3">
      <DetailHeaderName detail={detail} url={url} latestRevision={latestRevision} />
      <div className="grid grid-cols-3 grid-rows-3 gap-4 mt-10">
        <ExploreSectionDetailField
          title="Description"
          field={detail?.description}
          className={['col-span-2', 'row-span-2']}
        />
        <ExploreSectionDetailField title="M-Type" field={getMtype(detail)} />
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

function MorphologyDetail() {
  const { data: session } = useSession();
  const nexus = createNexusClient({ uri: nexusConfig.url, token: session?.accessToken });
  const path = usePathname();
  const params = useSearchParams();
  const rev = params?.get('rev');
  const detail = useAtomValue(loadable(detailAtom));
  const latestRevision = useAtomValue(latestRevisionAtom);
  const setInfo = useSetAtom(infoAtom);

  useEffect(() => setInfoWithPath(path, setInfo, rev), [path, rev, setInfo]);

  const links: Array<SideLink> = [{ url: '/observatory/morphology', title: 'Neuron Morphology' }];

  if (detail.state === 'hasError') {
    return <Error statusCode={400} title="Something went wrong while fetching the data" />;
  }

  if (detail.state === 'loading' || !session || !detail.data) {
    return <CentralLoadingSpinner />;
  }

  if (detail?.data?.reason) {
    return <Error statusCode={404} title={detail?.data?.reason} />;
  }

  return (
    <div className="flex h-screen" style={{ background: '#d1d1d1' }}>
      <Sidebar links={links} />
      <div className="bg-white w-full h-full overflow-scroll flex flex-col p-7 pr-12 gap-7">
        <MorphologyDetailHeader detail={detail.data} url={path} latestRevision={latestRevision} />
        {detail && session && <MorphoViewerContainer resource={detail.data} nexus={nexus} />}
      </div>
    </div>
  );
}

function MorphologyDetailPage() {
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <MorphologyDetail />
    </Suspense>
  );
}

export default MorphologyDetailPage;
