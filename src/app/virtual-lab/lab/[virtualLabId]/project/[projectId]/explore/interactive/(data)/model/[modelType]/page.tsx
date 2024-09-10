'use client';

import { notFound, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

import { DataType } from '@/constants/explore-section/list-views';
import { MODEL_DATA_TYPES } from '@/constants/explore-section/data-types/model-data-types';
import { ExploreDataScope } from '@/types/explore-section/application';
import { VirtualLabInfo } from '@/types/virtual-lab/common';

const ExploreEModelTable = dynamic(
  () => import('@/components/explore-section/EModel/ExploreEModelTable')
);
const ExploreMEModelTable = dynamic(
  () => import('@/components/explore-section/MEModel/ExploreMEModelTable')
);

const ExploreSynaptomeModelTable = dynamic(
  () => import('@/components/explore-section/Synaptome/ExploreSynaptomeModelTable')
);

export default function VirtualLabModelListingView() {
  const params = useParams<{ modelType: string; virtualLabId: string; projectId: string }>();
  const currentModel = Object.keys(MODEL_DATA_TYPES).find(
    (key) => MODEL_DATA_TYPES[key].name === params?.modelType ?? ''
  );
  const virtualLabInfo: VirtualLabInfo = {
    virtualLabId: params.virtualLabId,
    projectId: params.projectId,
  };
  if (!currentModel) notFound();

  switch (currentModel as DataType) {
    case DataType.CircuitEModel:
      return (
        <ExploreEModelTable
          virtualLabInfo={virtualLabInfo}
          dataType={currentModel as DataType}
          dataScope={ExploreDataScope.SelectedBrainRegion}
        />
      );
    case DataType.CircuitMEModel:
      return (
        <ExploreMEModelTable
          virtualLabInfo={virtualLabInfo}
          dataType={currentModel as DataType}
          dataScope={ExploreDataScope.SelectedBrainRegion}
        />
      );
    case DataType.SingleNeuronSynaptome:
      return (
        <ExploreSynaptomeModelTable
          virtualLabInfo={virtualLabInfo}
          dataType={currentModel as DataType}
          dataScope={ExploreDataScope.SelectedBrainRegion}
        />
      );
    default:
      notFound();
  }
}
