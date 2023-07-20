import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

import { MenuItem } from '@/components/TopNavigation/types';
import TopNavigation from '@/components/TopNavigation';

const items: MenuItem[] = [
  {
    id: 'macro',
    label: 'Macro',
    href: '/build/connectome-definition/configuration/macro',
  },
  {
    id: 'micro',
    label: 'Micro',
    href: '/build/connectome-definition/configuration/micro',
  },
];

export default function GranularityTabs() {
  const pathname = usePathname();

  const activeItemIndex = useMemo(
    () => items.findIndex((item) => !!pathname?.includes(item.href ?? '')),
    [pathname]
  );

  return <TopNavigation.PillNav items={items} activeItemIndex={activeItemIndex} />;
}
