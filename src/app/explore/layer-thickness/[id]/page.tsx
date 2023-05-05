'use client';

import { Key, Suspense, useEffect } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { useSession } from 'next-auth/react';
import { format, parseISO } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import Error from 'next/error';
import { loadable } from 'jotai/utils';
import usePathname from '@/hooks/pathname';
import Sidebar from '@/components/explore-section/Sidebar';
import { DeltaResource, SideLink } from '@/types/explore-section';
import { setInfoWithPath } from '@/util/explore-section/detail-view';
import createDetailAtoms from '@/state/explore-section/detail-atoms-constructor';
import ExploreSectionDetailField, {
  ExploreSectionDetailFieldProps,
} from '@/components/explore-section/ExploreSectionDetailField';
import DetailHeaderName from '@/components/explore-section/DetailHeaderName';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import { ensureArray } from '@/util/nexus';

const { infoAtom, detailAtom, latestRevisionAtom } = createDetailAtoms();

function LayerThicknessDetailHeader({
  detail,
  url,
  latestRevision,
}: {
  detail: DeltaResource;
  url?: string | null;
  latestRevision: number | null;
}) {
  if (!detail) return <>Not Found</>;

  const thickness = detail?.series?.find(
    ({ statistic }: { statistic: string }) => statistic === 'mean'
  );
  const thicknessField = {
    className: 'col-span-2',
    title: 'Thickness',
    field: thickness?.value,
    textAfterField: thickness?.unitCode,
  };

  const contributors = ensureArray(detail?.contribution).reduce(
    (acc, cur) => [...acc, cur?.agent?.['@id']],
    [] as any
  ) as string[];

  const contributionField = {
    title: contributors.length === 1 ? 'Contributor' : 'Contributors',
    field: (
      <ul>
        {contributors?.map((contributor) => (
          <li key={contributor}>{contributor}</li>
        ))}
      </ul>
    ),
  };

  const fields = (
    [
      {
        title: 'Description',
        field: detail?.description,
        className: 'col-span-2 row-span-2',
      },
      {
        title: 'Brain Region',
        field: detail?.brainLocation?.brainRegion?.label,
      },
      {
        title: 'Species',
        field: detail?.subject?.species?.label,
      },
      thicknessField,
      contributionField,
      {
        title: 'Added',
        field: detail?._createdAt && (
          <div className="mt-3">{format(parseISO(detail?._createdAt), 'dd.MM.yyyy')}</div>
        ),
      },
      {
        title: 'Licence',
        field: detail?.license?.['@id'],
      },
    ] as ExploreSectionDetailFieldProps[]
  ).map((field) => (
    <ExploreSectionDetailField
      key={field.title as Key}
      className={field.className}
      title={field.title}
      field={field.field}
      textAfterField={field.textAfterField}
    />
  ));

  return (
    <div className="max-w-screen-lg">
      <DetailHeaderName detail={detail} url={url} latestRevision={latestRevision} />
      <div className="grid grid-cols-4 gap-4 mt-10">{fields}</div>
    </div>
  );
}

function LayerThicknessDetail() {
  const { data: session } = useSession();
  const path = usePathname();
  const params = useSearchParams();
  const rev = params?.get('rev');
  const detail = useAtomValue(loadable(detailAtom));
  const latestRevision = useAtomValue(latestRevisionAtom);
  const setInfo = useSetAtom(infoAtom);

  useEffect(() => setInfoWithPath(path, setInfo, rev), [path, rev, setInfo]);

  const links: Array<SideLink> = [{ url: '/explore/layer-thickness', title: 'Layer thickness' }];

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
      <div className="bg-white w-full h-full overflow-scroll p-7 pr-12">
        <LayerThicknessDetailHeader
          detail={detail.data}
          url={path}
          latestRevision={latestRevision}
        />
      </div>
    </div>
  );
}

export default function LayerThicknessDetailPage() {
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <LayerThicknessDetail />
    </Suspense>
  );
}
