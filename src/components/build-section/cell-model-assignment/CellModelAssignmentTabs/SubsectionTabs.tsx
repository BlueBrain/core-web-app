import { usePathname } from 'next/navigation';

import Link from '@/components/Link';
import { classNames } from '@/util/utils';

const baseHref = '/build/cell-model-assignment';

type ModeTabsType = {
  name: string;
  href: string;
  disabled?: boolean;
};

const defaultStyle = 'ml-5';

export default function SubsectionTabs() {
  const pathname = usePathname();

  const modeTabs: ModeTabsType[] = [
    { name: 'M-Model', href: `${baseHref}/m-model/interactive` },
    { name: 'E-Model', href: `${baseHref}/e-model/interactive`, disabled: true },
    { name: 'ME-Model', href: `${baseHref}/me-model/interactive`, disabled: true },
  ];

  const getTabClassName = (tab: ModeTabsType) => {
    const isDisabled = tab.disabled;
    const active = !!pathname?.startsWith(tab.href);
    return classNames(
      isDisabled ? 'pointer-events-none' : '',
      active ? 'font-bold text-primary-8 border-b-2 border-primary-8' : 'text-gray-600',
      defaultStyle
    );
  };

  return (
    <div>
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
