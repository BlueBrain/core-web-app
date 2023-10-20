import { ReactNode, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import Error from 'next/error';
import { loadable } from 'jotai/utils';
import { DetailsPageSideBackLink } from '@/components/explore-section/Sidebar';
import { detailFamily } from '@/state/explore-section/detail-view-atoms';
import { DeltaResource } from '@/types/explore-section/resources';
import { DetailProps } from '@/types/explore-section/application';
import DetailHeader from '@/components/explore-section/DetailHeader';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import usePathname from '@/hooks/pathname';

export default function Detail({
  fields,
  children,
}: {
  fields: DetailProps[];
  children?: (detail: DeltaResource) => ReactNode;
}) {
  const resourceInfo = useResourceInfoFromPath();
  const path = usePathname();

  const detail = useAtomValue(useMemo(() => loadable(detailFamily(resourceInfo)), [resourceInfo]));
  if (detail.state === 'loading') {
    return <CentralLoadingSpinner />;
  }

  if (detail.state === 'hasError') {
    return <Error statusCode={400} title="Something went wrong while fetching the data" />;
  }

  if (detail?.data?.reason) {
    return <Error statusCode={404} title={detail?.data?.reason} />;
  }

  if (detail.data === null) {
    return <>Not Found</>;
  }

  return (
    <div className="flex h-screen">
      <DetailsPageSideBackLink />
      <div className="bg-white w-full h-full overflow-scroll p-7 pr-12 flex flex-col gap-7">
        <DetailHeader fields={fields} detail={detail.data} url={path} />
        {children && detail.data && children(detail.data)}
      </div>
    </div>
  );
}
