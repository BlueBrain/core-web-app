'use client';

import { notFound, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

import { DataType } from '@/constants/explore-section/list-views';
import { MODEL_DATA_TYPES } from '@/constants/explore-section/data-types/model-data-types';

const ExploreEModelTable = dynamic(
  () => import('@/components/explore-section/EModel/ExploreEModelTable')
);
const ExploreMEModelTable = dynamic(
  () => import('@/components/explore-section/MEModel/ExploreMEModelTable')
);

export default function VirtualLabModelListingView() {
  const params = useParams<{ modelType: string }>();
  const currentModel = Object.keys(MODEL_DATA_TYPES).find(
    (key) => MODEL_DATA_TYPES[key].name === params?.modelType ?? ''
  );
  if (!currentModel) notFound();

  switch (currentModel as DataType) {
    case 'CircuitEModel':
      return (
        <ExploreEModelTable
          enableDownload
          dataType={currentModel as DataType}
          brainRegionSource="selected"
        />
      );
    case 'CircuitMEModel':
      return (
        <ExploreMEModelTable
          enableDownload
          dataType={currentModel as DataType}
          brainRegionSource="selected"
        />
      );
    default:
      notFound();
  }
}
