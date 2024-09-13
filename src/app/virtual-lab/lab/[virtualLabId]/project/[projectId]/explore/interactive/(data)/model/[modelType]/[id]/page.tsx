'use client';

import dynamic from 'next/dynamic';

const EModelDetailView = dynamic(
  () => import('@/components/explore-section/EModel/DetailView/View')
);
const MEModelDetailView = dynamic(
  () => import('@/components/explore-section/MEModel/DetailView/View')
);
const SynaptomeDetailView = dynamic(
  () => import('@/components/explore-section/Synaptome/DetailView')
);

type Params = {
  params: {
    modelType: string;
    projectId: string;
    virtualLabId: string;
  };
};

export default function DetailPage({ params }: Params) {
  switch (params.modelType) {
    case 'e-model':
      return <EModelDetailView />;
    case 'me-model':
      return <MEModelDetailView params={params} />;
    case 'synaptome':
      return <SynaptomeDetailView params={params} />;
    default:
      break;
  }
}
