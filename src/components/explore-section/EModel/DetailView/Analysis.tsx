'use client';

import { Loadable } from 'jotai/vanilla/utils/loadable';
import { PDFViewerContainer } from '@/components/explore-section/common/pdf/PDFViewerContainer';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import { EModelResource } from '@/types/explore-section/delta-model';
import { useLoadableValue } from '@/hooks/hooks';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import { detailFamily } from '@/state/explore-section/detail-view-atoms';
import { ensureArray } from '@/util/nexus';

export default function Analysis() {
  const resourceInfo = useResourceInfoFromPath();
  const detail = useLoadableValue(detailFamily(resourceInfo)) as Loadable<EModelResource>;

  if (detail.state === 'loading') {
    return <CentralLoadingSpinner />;
  }

  if (detail.state === 'hasError') {
    return null;
  }

  return (
    <div className="-mt-7 border border-primary-8 p-6">
      <PDFViewerContainer distributions={ensureArray(detail.data.distribution)} />
    </div>
  );
}
