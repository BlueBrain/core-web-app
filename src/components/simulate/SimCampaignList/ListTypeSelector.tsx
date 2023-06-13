import { ReactNode } from 'react';
import { useAtom } from 'jotai';

import { searchConfigListTypeAtom } from '@/state/simulate';
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
    name: 'Public simulation campaign configurations',
    icon: <SettingsIcon />,
  },
  {
    id: 'personal',
    name: 'My simulation campaign configurations',
    icon: <UserIcon />,
  },
];

export default function ListTypeSelector() {
  const [activeTabId, setActiveTabId] = useAtom(searchConfigListTypeAtom);

  return (
    <div className="flex gap-6 mt-6 mb-3">
      {searchTabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={classNames(
            'h-10 py-2 px-6 rounded-md font-bold mt-4',
            'text-primary-4 text-2xl flex gap-2 items-center',
            'hover:bg-[#ffffff0f] hover:text-white',
            activeTabId === tab.id ? 'text-white' : null
          )}
          onClick={() => setActiveTabId(tab.id)}
        >
          {tab.icon}
          {tab.name}
        </button>
      ))}
    </div>
  );
}
