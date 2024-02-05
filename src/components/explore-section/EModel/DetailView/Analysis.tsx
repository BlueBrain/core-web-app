'use client';

import { Loadable } from 'jotai/vanilla/utils/loadable';
import { PDFViewerContainer } from './PDFViewerContainer';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import { DetailType } from '@/constants/explore-section/fields-config/types';
import { useLoadableValue } from '@/hooks/hooks';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import { detailFamily } from '@/state/explore-section/detail-view-atoms';

export default function Analysis() {
  const resourceInfo = useResourceInfoFromPath();
  const detail = useLoadableValue(detailFamily(resourceInfo)) as Loadable<DetailType>;

  if (detail.state === 'loading') {
    return <CentralLoadingSpinner />;
  }

  if (detail.state === 'hasError') {
    return null;
  }

  return (
    <PDFViewerContainer
      distributions={
        Array.isArray(detail.data.distribution)
          ? detail.data.distribution
          : [detail.data.distribution]
      }
    />
  );
}
