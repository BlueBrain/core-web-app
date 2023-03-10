import { ReactNode } from 'react';
import { useAtomValue } from 'jotai';
import * as Popover from '@radix-ui/react-popover';

import usePathname from '@/hooks/pathname';
import Link from '@/components/Link';
import { themeAtom, Theme } from '@/state/theme';
import { classNames } from '@/util/utils';

const COMMON_CLASSNAME = 'flex-auto text-center h-12 leading-[3rem] mr-px';

type Tab = {
  name: string;
  href: string;
  baseHref: string;
};

const tabs: Tab[] = [
  {
    name: 'Cell composition',
    href: '/lab/cell-composition/interactive',
    baseHref: '/lab/cell-composition',
  },
  {
    name: 'Cell model assignment',
    href: '/lab/cell-model-assignment',
    baseHref: '/lab/cell-model-assignment',
  },
  {
    name: 'Connectome definition',
    href: '/lab/connectome-definition',
    baseHref: '/lab/connectome-definition',
  },
  {
    name: 'Connection model assignment',
    href: '/lab/connectome-model-assignment',
    baseHref: '/lab/connectome-model-assignment',
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

type BrainFactoryTabsProps = {
  children: ReactNode;
};

export default function BrainFactoryTabs({ children }: BrainFactoryTabsProps) {
  const theme = useAtomValue(themeAtom);
  const pathname = usePathname();

  return (
    <div className="flex">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={getTabClassName(!!pathname?.startsWith(tab.baseHref), theme)}
          preserveLocationSearchParams
        >
          {tab.name}
        </Link>
      ))}

      <Popover.Root>
        <Popover.Trigger className="flex-auto bg-secondary-2 text-white h-12 px-8">
          Build & Simulate
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="text-white z-[100] flex flex-col">
            {children}
            <Popover.Arrow className="fill-white" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
