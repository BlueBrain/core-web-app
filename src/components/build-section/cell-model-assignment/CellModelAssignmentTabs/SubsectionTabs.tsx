/* eslint-disable @typescript-eslint/no-use-before-define */
import { usePathname } from 'next/navigation';

import Link from '@/components/Link';
import { classNames } from '@/util/utils';

const baseHref = '/build/cell-model-assignment';

type ModeTabsType = {
  name: string;
  href: string;
  disabled?: boolean;
};

type Props = {
  className?: string;
};

export default function SubsectionTabs({ className }: Props) {
  const pathname = usePathname();

  const modeTabs: ModeTabsType[] = [
    { name: 'M-Model', href: `${baseHref}/m-model` },
    { name: 'E-Model', href: `${baseHref}/e-model`, disabled: true },
    { name: 'ME-Model', href: `${baseHref}/me-model`, disabled: true },
  ];

  const getTabClassName = (tab: ModeTabsType) => {
    const isDisabled = tab.disabled;
    const active = !!pathname?.startsWith(tab.href);

    return classNames(
      isDisabled ? 'pointer-events-none' : '',
      active ? 'font-bold border-b-2' : '',
      className
    );
  };

  return (
    <div className="flex justify-start items-center shrink-0 gap-4">
      {modeTabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={getTabClassName(tab)}
          preserveLocationSearchParams
        >
          {tab.name}
        </Link>
      ))}
    </div>
  );
}
