'use client';

import { Key, Suspense, useEffect } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { createNexusClient } from '@bbp/nexus-sdk';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Error from 'next/error';
import { loadable } from 'jotai/utils';
import usePathname from '@/hooks/pathname';
import { nexus as nexusConfig } from '@/config';
import Sidebar from '@/components/explore-section/Sidebar';
import { DeltaResource, SideLink } from '@/types/explore-section';
import { setInfoWithPath } from '@/util/explore-section/detail-view';
import createDetailAtoms from '@/state/explore-section/detail-atoms-constructor';
import ExploreSectionDetailField, {
  ExploreSectionDetailFieldProps,
} from '@/components/explore-section/ExploreSectionDetailField';
import DetailHeaderName from '@/components/explore-section/DetailHeaderName';
import MorphoViewerContainer from '@/components/explore-section/MorphoViewerContainer';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import useExploreSerializedFields from '@/hooks/useExploreSerializedFields';

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
  const { description, mType, brainRegion, creationDate, contributors } =
    useExploreSerializedFields(detail);

  const fields = (
    [
      {
        title: 'Description',
        field: description,
        className: 'col-span-2 row-span-2',
      },
      {
        title: 'M-Type',
        field: mType,
      },
      {
        title: 'Brain Location',
        field: brainRegion,
      },
      {
        title: 'Contributors',
        field: contributors,
      },
      {
        title: 'Added',
        field: creationDate,
      },
    ] as ExploreSectionDetailFieldProps[]
  ).map((field) => (
    <ExploreSectionDetailField
      key={field.title as Key}
      className={field.className}
      title={field.title}
      field={field.field}
    />
  ));

  return (
    <div className="max-w-screen-lg">
      <DetailHeaderName detail={detail} url={url} latestRevision={latestRevision} />
      <div className="grid grid-cols-3 gap-4 mt-10">{fields}</div>
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

  const links: Array<SideLink> = [{ url: '/explore/morphology', title: 'Neuron Morphology' }];

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
    <div className="flex h-screen">
      <Sidebar links={links} />
      <div className="bg-white w-full h-full overflow-scroll p-7 pr-12 flex flex-col gap-7">
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
