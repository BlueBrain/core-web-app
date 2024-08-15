'use client';

import dynamic from 'next/dynamic';

import { generateVlProjectUrl } from '@/util/virtual-lab/urls';

const EModelDetailView = dynamic(
  () => import('@/components/explore-section/EModel/DetailView/View')
);
const MEModelDetailView = dynamic(
  () => import('@/components/explore-section/MEModel/DetailView/View')
);

type Params = {
  params: {
    modelType: string;
    projectId: string;
    virtualLabId: string;
  };
};

export default function DetailPage({ params }: Params) {
  const vlProjectUrl = generateVlProjectUrl(params.virtualLabId, params.projectId);

  switch (params.modelType) {
    case 'e-model':
      return <EModelDetailView />;
    case 'me-model':
      return <MEModelDetailView params={params} vlProjectUrl={vlProjectUrl} />;
    default:
      break;
  }
}
