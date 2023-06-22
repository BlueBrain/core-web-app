import { ReactNode } from 'react';
import { useAtomValue } from 'jotai';

import { classNames } from '@/util/utils';
import Link from '@/components/Link';
import usePathname from '@/hooks/pathname';
import { themeAtom, Theme } from '@/state/theme';
import BrainIcon from '@/components/icons/Brain';
import AnalysisIcon from '@/components/icons/Analysis';
import SettingsIcon from '@/components/icons/Settings';

const COMMON_TAB_CLASSNAME = 'text-center py-2 px-8 rounded-3xl flex gap-2 items-center';

type CellModelAssignmentTab = {
  name: string;
  href: string;
  icon: ReactNode;
  disableOnChange?: boolean;
};

const tabs: CellModelAssignmentTab[] = [
  {
    name: 'Interactive',
    href: '/build/cell-model-assignment/m-model/interactive',
    icon: <BrainIcon className="h-4" />,
  },
  {
    name: 'Analysis',
    href: '/build/cell-model-assignment/m-model/analysis',
    icon: <AnalysisIcon className="h-4" />,
  },
  {
    name: 'Configuration',
    href: '/build/cell-model-assignment/m-model/configuration',
    icon: <SettingsIcon className="h-4" />,
  },
];

function getTabClassName(active: boolean, theme: Theme) {
  let className;

  if (theme === 'light') {
    className = active ? 'bg-primary-7 text-white' : 'bg-white text-primary-7';
  } else {
    className = active ? 'bg-black text-white' : 'bg-white text-black';
  }

  return classNames(COMMON_TAB_CLASSNAME, className);
}

export default function ModeTabs() {
  const theme = useAtomValue(themeAtom);
  const pathname = usePathname();

  return (
    <div className="flex gap-2 flex-wrap justify-end shrink">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={getTabClassName(!!pathname?.startsWith(tab.href), theme)}
          preserveLocationSearchParams
        >
          {tab.icon}
          {tab.name}
        </Link>
      ))}
    </div>
  );
}
