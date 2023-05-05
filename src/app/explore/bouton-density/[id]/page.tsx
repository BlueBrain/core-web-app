'use client';

import { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { format, parseISO } from 'date-fns';
import { loadable } from 'jotai/utils';
import { useSession } from 'next-auth/react';
import Error from 'next/error';
import { useSearchParams } from 'next/navigation';
import createDetailAtoms from '@/state/explore-section/detail-atoms-constructor';
import usePathname from '@/hooks/pathname';
import { setInfoWithPath } from '@/util/explore-section/detail-view';
import { DeltaResource, SideLink } from '@/types/explore-section';
import Sidebar from '@/components/explore-section/Sidebar';
import ExploreSectionDetailField from '@/components/explore-section/ExploreSectionDetailField';
import DetailHeaderName from '@/components/explore-section/DetailHeaderName';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';

const { infoAtom, detailAtom, latestRevisionAtom } = createDetailAtoms();

function BoutonDensityHeader({
  detail,
  url,
  latestRevision,
}: {
  detail: DeltaResource;
  url?: string | null;
  latestRevision: number | null;
}) {
  if (!detail) return <>Not Found</>;
  const infoFields = [
    {
      title: 'Description',
      field: detail?.description,
      className: 'col-span-3 row-span-2',
    },
    {
      title: 'Contributor',
      field: detail?._createdBy?.split('/')?.pop(),
      className: 'col-span-1',
    },
    {
      title: 'Created on',
      field: detail?._createdAt && (
        <div className="mt-3">{format(parseISO(detail?._createdAt), 'dd.MM.yyyy')}</div>
      ),
      className: 'col-span-1',
    },
    {
      title: 'Reference',
      field: detail?.createdAt && <div className="mt-3">TBF</div>,
      className: 'col-span-1',
    },
  ].map((field) => (
    <ExploreSectionDetailField
      key={field.title}
      className={field.className}
      title={field.title}
      field={field.field}
    />
  ));

  const metricFields = [
    {
      title: 'Brain region',
      field: detail?.brainRegion?.label,
      className: 'col-span-1',
    },
    {
      title: 'Mean ± STD',
      field: detail?.boutonDensity?.value,
      textAfterField: 'boutons / μm',
      className: 'col-span-1',
    },
    {
      title: 'Species',
      field: detail?.subject?.species?.label,
      className: 'col-span-1',
    },
    {
      title: 'M-Type',
      field: detail?.mType?.label,
      className: 'col-span-1',
    },
    {
      title: 'SEM',
      field: 'Not indexed',
      className: 'col-span-1',
    },
    {
      title: 'Weight',
      field: 'Not indexed',
      className: 'col-span-1',
    },
    {
      title: 'N˚ of cells',
      field: 'Not indexed',
      className: 'col-span-1',
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
    <div className="grid grid-cols-2">
      <div className="col-span-2">
        <DetailHeaderName detail={detail} url={url} latestRevision={latestRevision} />
      </div>
      <div className="col-span-1">
        <div className="grid grid-cols-3 grid-rows-2 gap-5 mt-10">{infoFields}</div>
      </div>
      <div className="col-span-1">
        <div className="grid grid-cols-3 grid-rows-3 gap-5 mt-10">{metricFields}</div>
      </div>
    </div>
  );
}

function BoutonDensityDetailsPage() {
  const { data: session } = useSession();
  const path = usePathname();
  const params = useSearchParams();
  const rev = params?.get('rev');
  const detail = useAtomValue(loadable(detailAtom));
  const latestRevision = useAtomValue(latestRevisionAtom);
  const setInfo = useSetAtom(infoAtom);

  useEffect(() => setInfoWithPath(path, setInfo, rev), [path, rev, setInfo]);

  const links: Array<SideLink> = [{ url: '/explore/bouton-density', title: 'Bouton density' }];

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
        <BoutonDensityHeader detail={detail.data} url={path} latestRevision={latestRevision} />
      </div>
    </div>
  );
}

export default function BoutonDensityDetails() {
  return (
    <DefaultLoadingSuspense>
      <BoutonDensityDetailsPage />
    </DefaultLoadingSuspense>
  );
}
