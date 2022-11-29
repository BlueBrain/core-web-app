import { ReactNode } from 'react';
import Link from 'next/link';
import { useAtomValue } from 'jotai';
import { usePathname } from 'next/navigation';

import { themeAtom, Theme } from '@/state/theme';
import { classNames } from '@/util/utils';

type Props = {
  children: ReactNode;
};

const COMMON_CLASSNAME = 'flex-auto text-center h-12 leading-[3rem] mr-px';

const tabs = [
  {
    name: 'Cell composition',
    href: '/brain-factory/cell-composition',
  },
  {
    name: 'Cell model assignment',
    href: '/brain-factory/cell-model-assignment',
  },
  {
    name: 'Connectome definition',
    href: '/brain-factory/connectome-definition',
  },
  {
    name: 'Connection model assignment',
    href: '/brain-factory/connectome-model-assignment',
  },
];

function getTabClassName(active: boolean, theme: Theme) {
  let className;

  if (theme === 'light') {
    className = active ? 'bg-neutral-1 text-primary-7' : 'bg-primary-7 text-white';
  } else {
    className = active ? 'bg-neutral-1 text-black' : 'bg-black text-neutral-1';
  }

  return classNames(COMMON_CLASSNAME, className);
}

export default function BrainFactoryTabs({ children }: Props) {
  const theme = useAtomValue(themeAtom);
  const pathname = usePathname();

  return (
    <div className="flex">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={getTabClassName(tab.href === pathname, theme)}
        >
          {tab.name}
        </Link>
      ))}

      {children}
    </div>
  );
}
