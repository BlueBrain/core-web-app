import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import usePathname from '@/hooks/pathname';
import { pathToResource } from '@/util/explore-section/detail-view';

export default function useResourceInfoFromPath() {
  const path = usePathname();
  const params = useSearchParams();
  const rev = params?.get('rev');
  return useMemo(() => pathToResource(path, rev), [path, rev]);
}
