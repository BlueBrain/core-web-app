'use client';

import { notFound, useParams } from 'next/navigation';

import { DataType } from '@/constants/explore-section/list-views';
import { MODEL_DATA_TYPES } from '@/constants/explore-section/data-types/model-data-types';
import WithExploreEModel from '@/components/explore-section/EModel/WithExploreEModel';

export default function VirtualLabModelListingView() {
  const params = useParams<{ modelType: string }>();
  const currentModel = Object.keys(MODEL_DATA_TYPES).find(
    (key) => MODEL_DATA_TYPES[key].name === params?.modelType ?? ''
  );
  if (!currentModel) notFound();

  return (
    <WithExploreEModel
      enableDownload
      dataType={currentModel as DataType}
      brainRegionSource="selected"
    />
  );
}
