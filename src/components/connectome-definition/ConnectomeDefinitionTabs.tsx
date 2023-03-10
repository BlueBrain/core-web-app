import { ReactNode } from 'react';

import Link from '@/components/Link';
import { classNames } from '@/util/utils';
import BrainIcon from '@/components/icons/Brain';
import AnalysisIcon from '@/components/icons/Analysis';
import SettingsIcon from '@/components/icons/Settings';

// TODO: use common features as CellCompositionTabs
const COMMON_TAB_CLASSNAME =
  'text-center py-2 px-8 ml-2 first:ml-0 rounded-3xl last:bg-white last:text-black';

type CellCompositionTab = {
  name: string;
  href: string;
  icon: ReactNode;
  disableOnChange?: boolean;
};

const tabs: CellCompositionTab[] = [
  {
    name: 'Interactive',
    href: '/connectome-definition/interactive',
    icon: <BrainIcon className="h-4 inline-block mr-2" />,
  },
  {
    name: 'Analysis',
    href: '/connectome-definition/analysis',
    icon: <AnalysisIcon className="h-4 inline-block mr-2" />,
  },
  {
    name: 'Configuration',
    href: '/connectome-definition/configuration',
    icon: <SettingsIcon className="h-4 inline-block mr-2" />,
  },
];

export default function ConnectomeDefinitionTabs() {
  return (
    <div className="absolute right-7 top-7 z-10">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={classNames(COMMON_TAB_CLASSNAME, 'bg-black text-white')}
          preserveLocationSearchParams
        >
          {tab.icon}
          {tab.name}
        </Link>
      ))}
    </div>
  );
}
