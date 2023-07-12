import { useCallback, useMemo } from 'react';
import findIndex from 'lodash/findIndex';

import { MenuItem } from '@/components/TopNavigation/types';
import TopNavigation from '@/components/TopNavigation';

interface GranularityTabsProps {
  activeTabId: string;
  handleChange: (key: string) => void;
}

const items: MenuItem[] = [
  {
    id: 'macro',
    label: 'Macro',
  },
  {
    id: 'micro',
    label: 'Micro',
  },
];

export default function GranularityTabs({ activeTabId, handleChange }: GranularityTabsProps) {
  const activeItemIndex = useMemo(() => {
    const index = findIndex(items, (item) => item.id === (activeTabId ?? 'macro'));
    if (index === -1) {
      return 0;
    }
    return index;
  }, [activeTabId]);

  const handleActiveItemChange = useCallback(
    (itemIndex: number) => {
      handleChange(items[itemIndex].id ?? 'macro');
    },
    [handleChange]
  );

  return (
    <TopNavigation.PillNav
      items={items}
      activeItemIndex={activeItemIndex}
      onChange={handleActiveItemChange}
    />
  );
}
