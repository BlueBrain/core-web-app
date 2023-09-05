'use client';

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { useSearchParams } from 'next/navigation';
import { infoAtom } from '@/state/explore-section/detail-view-atoms';
import { setInfoWithPath } from '@/util/explore-section/detail-view';

export default function useDetailPage(path: string | null | undefined) {
  const params = useSearchParams();
  const rev = params?.get('rev');
  const setInfo = useSetAtom(infoAtom);

  useEffect(() => {
    setInfoWithPath(path, setInfo, rev);
  }, [path, rev, setInfo]);
}
