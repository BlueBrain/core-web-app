'use client';

import { Suspense, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useAtomValue, useSetAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import Error from 'next/error';
import usePathname from '@/hooks/pathname';
import { setInfoWithPath } from '@/util/explore-section/detail-view';
import { DeltaResource, SideLink } from '@/types/explore-section';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import Sidebar from '@/components/explore-section/Sidebar';
import createDetailAtoms from '@/state/explore-section/detail-atoms-constructor';
import DetailHeaderName from '@/components/explore-section/DetailHeaderName';
import ExploreSectionDetailField from '@/components/explore-section/ExploreSectionDetailField';
import useExploreSerializedFields from '@/hooks/useExploreSerializedFields';

const { infoAtom, detailAtom, latestRevisionAtom } = createDetailAtoms();

function NeuronDensityDetailHeader({
  detail,
  url,
  latestRevision,
}: {
  detail: DeltaResource;
  url?: string | null;
  latestRevision: number | null;
}) {
  const {
    description,
    subjectAge,
    species,
    numberOfMeasurement,
    meanPlusMinusStd,
    creationDate,
    createdBy,
  } = useExploreSerializedFields(detail);

  const fields = [
    {
      title: 'Description',
      field: description,
      className: 'col-span-2 row-span-2',
    },
    {
      title: 'Mean ± STD',
      field: meanPlusMinusStd,
    },
    {
      title: 'Species',
      field: species,
    },
    {
      title: 'Number of Measurement',
      field: numberOfMeasurement,
    },
    {
      title: 'Age',
      field: subjectAge,
    },
    {
      title: 'Contributor',
      field: createdBy,
    },
    {
      title: 'Added',
      field: creationDate,
    },
  ].map((field) => (
    <ExploreSectionDetailField
      key={field.title}
      className={field.className}
      title={field.title}
      field={field.field}
    />
  ));

  return (
    <div className="w-2/3">
      <DetailHeaderName detail={detail} url={url} latestRevision={latestRevision} />
      <div className="grid grid-cols-4 grid-rows-3 gap-4 mt-10">{fields}</div>
    </div>
  );
}

function NeuronDensityDetail() {
  const { data: session } = useSession();
  const path = usePathname();
  const params = useSearchParams();
  const rev = params?.get('rev');
  const detail = useAtomValue(loadable(detailAtom));
  const latestRevision = useAtomValue(latestRevisionAtom);
  const setInfo = useSetAtom(infoAtom);

  useEffect(() => setInfoWithPath(path, setInfo, rev), [path, rev, setInfo]);

  const links: Array<SideLink> = [{ url: '/explore/neuron-density', title: 'Neuron Density' }];

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
        {detail.data && (
          <NeuronDensityDetailHeader
            detail={detail.data}
            url={path}
            latestRevision={latestRevision}
          />
        )}
      </div>
    </div>
  );
}

export default function NeuronDensityDetailPage() {
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <NeuronDensityDetail />
    </Suspense>
  );
}
