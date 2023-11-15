import { ReactNode } from 'react';
import Error from 'next/error';

import { Loadable } from 'jotai/vanilla/utils/loadable';
import { useSetAtom } from 'jotai';
import { DetailsPageSideBackLink } from '@/components/explore-section/Sidebar';
import { detailFamily } from '@/state/explore-section/detail-view-atoms';
import { brainRegionSidebarIsCollapsedAtom } from '@/state/brain-regions';
import { DetailProps } from '@/types/explore-section/application';
import DetailHeader from '@/components/explore-section/DetailHeader';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import usePathname from '@/hooks/pathname';
import { DetailType } from '@/constants/explore-section/fields-config/types';
import { useLoadableValue } from '@/hooks/hooks';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';

export default function Detail({
  fields,
  children,
}: {
  fields: DetailProps[];
  children?: (detail: DetailType) => ReactNode;
}) {
  const setBrainRegionSidebarIsCollapsed = useSetAtom(brainRegionSidebarIsCollapsedAtom);

  setBrainRegionSidebarIsCollapsed(true);

  const path = usePathname();
  const resourceInfo = useResourceInfoFromPath();
  const detail = useLoadableValue(detailFamily(resourceInfo)) as Loadable<DetailType>;

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
    return <h1>Selected resource not found</h1>;
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
