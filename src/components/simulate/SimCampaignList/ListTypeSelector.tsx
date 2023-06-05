import { ReactNode } from 'react';
import { useAtom } from 'jotai';

import { Button } from 'antd';
import { searchConfigListTypeAtom } from '@/state/experiment-designer';
import { SettingsIcon } from '@/components/icons';
import UserIcon from '@/components/icons/User';
import { classNames } from '@/util/utils';

type TabType = 'public' | 'personal';

type SearchTab = {
  id: TabType;
  name: string;
  icon: ReactNode;
};

const searchTabs: SearchTab[] = [
  {
    id: 'public',
    name: 'Public simulation campaigns',
    icon: <SettingsIcon />,
  },
  {
    id: 'personal',
    name: 'My simulation campaigns',
    icon: <UserIcon />,
  },
];

export default function ListTypeSelector() {
  const [activeTabId, setActiveTabId] = useAtom(searchConfigListTypeAtom);

  return (
    <div className="flex gap-6 mt-6 mb-3">
      {searchTabs.map((tab) => (
        <Button
          key={tab.id}
          type="text"
          className={classNames(
            'text-primary-4 text-2xl flex pl-0 gap-2 items-center',
            'hover:bg-[#ffffffe0] hover:text-white',
            activeTabId === tab.id ? 'text-white' : null
          )}
          icon={tab.icon}
          onClick={() => setActiveTabId(tab.id)}
        >
          {tab.name}
        </Button>
      ))}
    </div>
  );
}
