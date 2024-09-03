import { ReactNode, useEffect } from 'react';
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
import { DeltaResource } from '@/types/explore-section/resources';
import { useLoadableValue } from '@/hooks/hooks';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import { COMMON_FIELDS } from '@/constants/explore-section/detail-views-fields';

type ExtendsExperiment<T> = T extends DeltaResource ? T : never;

export default function Detail<T extends DeltaResource>({
  fields,
  showViewMode,
  withRevision,
  commonFields = COMMON_FIELDS,
  children,
}: {
  fields: DetailProps[];
  showViewMode?: boolean;
  commonFields?: DetailProps[];
  withRevision?: boolean;
  children?: (detail: ExtendsExperiment<T>) => ReactNode;
}) {
  const setBrainRegionSidebarIsCollapsed = useSetAtom(brainRegionSidebarIsCollapsedAtom);

  const path = usePathname();
  const resourceInfo = useResourceInfoFromPath();
  const detail = useLoadableValue(detailFamily(resourceInfo)) as Loadable<ExtendsExperiment<T>>;

  useEffect(() => {
    setBrainRegionSidebarIsCollapsed(true);
  }, [setBrainRegionSidebarIsCollapsed]);

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
    <div className="flex h-full min-h-screen">
      <DetailsPageSideBackLink />
      <div className="ml-10 flex h-full w-full flex-col gap-7 overflow-auto bg-white p-7 pr-12">
        {showViewMode && <div className="text-right font-thin text-gray-400">View mode</div>}
        <DetailHeader
          fields={fields}
          commonFields={commonFields}
          detail={detail.data}
          url={path}
          withRevision={withRevision}
        />
        {children && detail.data && children(detail.data)}
      </div>
    </div>
  );
}
