import { usePathname } from 'next/navigation';

import Link from '@/components/Link';
import { classNames } from '@/util/utils';

const baseHref = '/build/cell-model-assignment';

type ModeTabsType = {
  name: string;
  href: string;
  disabled?: boolean;
};

const modeTabs: ModeTabsType[] = [
  { name: 'M-Model', href: `${baseHref}/m-model` },
  { name: 'E-Model', href: `${baseHref}/e-model` },
  { name: 'ME-Model', href: `${baseHref}/me-model`, disabled: true },
];

const defaultRedirectPage = 'configuration';

type Props = {
  className?: string;
};

export default function SubsectionTabs({ className }: Props) {
  const pathname = usePathname();

  const getTabClassName = (tab: ModeTabsType) => {
    const isDisabled = tab.disabled;
    const active = !!pathname?.includes(tab.href);

    return classNames(
      isDisabled ? 'pointer-events-none' : '',
      active ? 'font-bold border-b-2' : '',
      className
    );
  };

  const currentMode = pathname?.match('-model/(.+)?')?.[1];

  return (
    <div className="flex justify-start items-center shrink-0 gap-4">
      {modeTabs.map((tab) => (
        <Link
          key={tab.href}
          href={`${tab.href}/${currentMode || defaultRedirectPage}`}
          className={getTabClassName(tab)}
          preserveLocationSearchParams
        >
          {tab.name}
        </Link>
      ))}
    </div>
  );
}
