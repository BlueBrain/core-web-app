'use client';

import { Loadable } from 'jotai/vanilla/utils/loadable';
import { PDFViewerContainer } from './PDFViewerContainer';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import { EModelResource } from '@/types/explore-section/delta-me-model';
import { useLoadableValue } from '@/hooks/hooks';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import { detailFamily } from '@/state/explore-section/detail-view-atoms';

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
    <div className="-mt-7 h-full border border-primary-8 p-6">
      <PDFViewerContainer
        distributions={
          Array.isArray(detail.data.distribution)
            ? detail.data.distribution
            : [detail.data.distribution]
        }
      />
    </div>
  );
}
