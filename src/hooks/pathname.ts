import { usePathname as useNextPathname } from 'next/navigation';

import { basePath } from '@/config';

export default function usePathname() {
  const nextPathname = useNextPathname();

  return basePath ? nextPathname?.replace(basePath, '') : nextPathname;
}
