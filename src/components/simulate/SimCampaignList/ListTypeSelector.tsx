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
    <div className="mb-3 mt-6 flex gap-6">
      {searchTabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={classNames(
            'mt-4 h-10 rounded-md px-6 py-2 font-bold',
            'flex items-center gap-2 text-2xl text-primary-4',
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
