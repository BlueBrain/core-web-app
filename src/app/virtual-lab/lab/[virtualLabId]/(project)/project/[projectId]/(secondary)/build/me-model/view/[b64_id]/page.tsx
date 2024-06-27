'use client';

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';

import MEModelDetailView from '@/components/explore-section/MEModel/DetailView/View';
import { backToListPathAtom } from '@/state/explore-section/detail-view-atoms';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';

type Params = {
  params: {
    projectId: string;
    virtualLabId: string;
  };
};

export default function MEModelViewPage({ params }: Params) {
  const vlProjectUrl = generateVlProjectUrl(params.virtualLabId, params.projectId);
  const setBackToListPath = useSetAtom(backToListPathAtom);

  useEffect(() => {
    setBackToListPath(`${vlProjectUrl}/build`);
  }, []);

  return <MEModelDetailView vlProjectUrl={vlProjectUrl} />;
}
