'use client';

import dynamic from 'next/dynamic';

import Nav from '@/components/build-section/virtual-lab/me-model/Nav';

type Props = {
  params: {
    projectId: string;
    virtualLabId: string;
  };
};

const SynaptomeDetailView = dynamic(
  () => import('@/components/explore-section/Synaptome/DetailView')
);

export default function Synaptome({ params }: Props) {
  return (
    <div className="grid grid-cols-[min-content_auto] overflow-hidden bg-white">
      <Nav params={{ ...params }} />
      <SynaptomeDetailView params={params} />
    </div>
  );
}
