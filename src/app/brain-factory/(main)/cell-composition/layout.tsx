'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useAtomValue } from 'jotai';

import { classNames } from '@/util/utils';
import Link from '@/components/Link';
import { themeAtom, Theme } from '@/state/theme';

const COMMON_TAB_CLASSNAME = 'text-center py-2 px-8 ml-2 first:ml-0 rounded-3xl';

const tabs = [
  {
    name: 'Interactive',
    href: '/brain-factory/cell-composition/interactive',
  },
  {
    name: 'Analysis',
    href: '/brain-factory/cell-composition/analysis',
  },
  {
    name: 'Configuration',
    href: '/brain-factory/cell-composition/configuration',
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
  const pathname = usePathname();

  return (
    <>
      <div className="absolute right-7 top-7 z-10">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={getTabClassName(!!pathname?.startsWith(tab.href), theme)}
          >
            {tab.name}
          </Link>
        ))}
      </div>

      {children}
    </>
  );
}
