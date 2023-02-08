'use client';

import { ReactNode } from 'react';
import { useAtomValue } from 'jotai/react';

import { classNames } from '@/util/utils';
import Link from '@/components/Link';
import usePathname from '@/hooks/pathname';
import { themeAtom, Theme } from '@/state/theme';
import BrainIcon from '@/components/icons/Brain';
import AnalysisIcon from '@/components/icons/Analysis';
import SettingsIcon from '@/components/icons/Settings';
import { cellCompositionHasChanged } from '@/state/brain-factory/brain-model-config/cell-composition';

const COMMON_TAB_CLASSNAME = 'text-center py-2 px-8 ml-2 first:ml-0 rounded-3xl';

type CellCompositionTab = {
  name: string;
  href: string;
  icon: ReactNode;
  disableOnChange?: boolean;
};

const tabs: CellCompositionTab[] = [
  {
    name: 'Interactive',
    href: '/brain-factory/cell-composition/interactive',
    icon: <BrainIcon className="h-4 inline-block mr-2" />,
  },
  {
    name: 'Analysis',
    href: '/brain-factory/cell-composition/analysis',
    icon: <AnalysisIcon className="h-4 inline-block mr-2" />,
    disableOnChange: true,
  },
  {
    name: 'Configuration',
    href: '/brain-factory/cell-composition/configuration',
    icon: <SettingsIcon className="h-4 inline-block mr-2" />,
  },
];

function getTabClassName(active: boolean, theme: Theme) {
  let className;

  if (theme === 'light') {
    className = active ? 'bg-white text-primary-7' : 'bg-primary-7 text-white';
  } else {
    className = active ? 'bg-white text-black' : 'bg-black text-white';
  }

  return classNames(COMMON_TAB_CLASSNAME, className);
}

type CellCompositionLayoutProps = {
  children: ReactNode;
};

export default function CellCompositionLayout({ children }: CellCompositionLayoutProps) {
  const theme = useAtomValue(themeAtom);
  const compositionHasChanged = useAtomValue(cellCompositionHasChanged);
  const pathname = usePathname();

  return (
    <>
      <div className="absolute right-7 top-7 z-10">
        {tabs.map((tab) =>
          tab.disableOnChange && compositionHasChanged ? null : (
            <Link
              key={tab.href}
              href={tab.href}
              className={getTabClassName(!!pathname?.startsWith(tab.href), theme)}
            >
              {tab.icon}
              {tab.name}
            </Link>
          )
        )}
      </div>

      {children}
    </>
  );
}
