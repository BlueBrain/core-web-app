'use client';

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';

import { ModelTypeNames } from '@/constants/explore-section/data-types/model-data-types';
import MEModelDetailView from '@/components/explore-section/MEModel/DetailView/View';
import { backToListPathAtom } from '@/state/explore-section/detail-view-atoms';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';
import Nav from '@/components/build-section/virtual-lab/me-model/Nav';

type Params = {
  params: {
    id: string;
    modelType: ModelTypeNames;
    projectId: string;
    virtualLabId: string;
  };
};

export default function MEModelViewPage({ params }: Params) {
  const vlProjectUrl = generateVlProjectUrl(params.virtualLabId, params.projectId);
  const setBackToListPath = useSetAtom(backToListPathAtom);

  useEffect(() => {
    setBackToListPath(`${vlProjectUrl}/build`);
  }, [setBackToListPath, vlProjectUrl]);

  return (
    <div className="grid grid-cols-[min-content_auto] overflow-hidden bg-white">
      <Nav params={params} />
      <div className="secondary-scrollbar h-screen w-full overflow-y-auto">
        <MEModelDetailView showViewMode params={params} />
      </div>
    </div>
  );
}
