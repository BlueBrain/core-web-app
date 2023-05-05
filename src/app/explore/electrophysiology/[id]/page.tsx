'use client';

import { Key, Suspense, useEffect, useMemo } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { createNexusClient } from '@bbp/nexus-sdk';
import { useSession } from 'next-auth/react';
import { loadable } from 'jotai/utils';
import Error from 'next/error';
import usePathname from '@/hooks/pathname';
import { nexus as nexusConfig } from '@/config';
import Sidebar from '@/components/explore-section/Sidebar';
import EphysViewerContainer from '@/components/explore-section/EphysViewerContainer';
import { DeltaResource, SideLink } from '@/types/explore-section';
import { setInfoWithPath } from '@/util/explore-section/detail-view';
import createDetailAtoms from '@/state/explore-section/detail-atoms-constructor';
import ExploreSectionDetailField, {
  ExploreSectionDetailFieldProps,
} from '@/components/explore-section/ExploreSectionDetailField';
import DetailHeaderName from '@/components/explore-section/DetailHeaderName';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import useExploreSerializedFields from '@/hooks/useExploreSerializedFields';

const { infoAtom, detailAtom, latestRevisionAtom } = createDetailAtoms();

function EphysDetailHeader({
  detail,
  url,
  latestRevision,
}: {
  detail: DeltaResource;
  url?: string | null;
  latestRevision: number | null;
}) {
  const { description, eType, brainRegion, creationDate, contributors } =
    useExploreSerializedFields(detail);

  const fields = (
    [
      {
        title: 'Description',
        field: description,
        className: 'col-span-2 row-span-2',
      },
      {
        title: 'E-Type',
        field: eType,
      },
      {
        title: 'Brain Region',
        field: brainRegion,
      },
      { title: 'Contributors', field: contributors },
      {
        title: 'Created On',
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

function EphysDetail() {
  const { data: session } = useSession();
  const nexus = createNexusClient({ uri: nexusConfig.url, token: session?.accessToken });
  const path = usePathname();
  const loadableDetails = useMemo(() => loadable(detailAtom), []);
  const detail = useAtomValue(loadableDetails);
  const setInfo = useSetAtom(infoAtom);

  const latestRevision = useAtomValue(latestRevisionAtom);

  useEffect(() => setInfoWithPath(path, setInfo), [path, setInfo]);

  const links: Array<SideLink> = [
    { url: '/explore/electrophysiology', title: 'Neuron Electrophysiology' },
  ];

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
        <EphysDetailHeader detail={detail.data} url={path} latestRevision={latestRevision} />
        {detail && session && <EphysViewerContainer resource={detail.data} nexus={nexus} />}
      </div>
    </div>
  );
}

export default function EphysDetailPage() {
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <EphysDetail />
    </Suspense>
  );
}
