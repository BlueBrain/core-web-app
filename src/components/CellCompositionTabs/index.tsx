import { ReactNode } from 'react';
import { useAtomValue } from 'jotai/react';
import { loadable } from 'jotai/vanilla/utils';

import { classNames } from '@/util/utils';
import Link from '@/components/Link';
import usePathname from '@/hooks/pathname';
import { themeAtom, Theme } from '@/state/theme';
import BrainIcon from '@/components/icons/Brain';
import AnalysisIcon from '@/components/icons/Analysis';
import SettingsIcon from '@/components/icons/Settings';
import { cellCompositionAtom } from '@/state/brain-model-config/cell-composition';

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
    href: '/lab/cell-composition/interactive',
    icon: <BrainIcon className="h-4 inline-block mr-2" />,
  },
  {
    name: 'Analysis',
    href: '/lab/cell-composition/analysis',
    icon: <AnalysisIcon className="h-4 inline-block mr-2" />,
    disableOnChange: true,
  },
  {
    name: 'Configuration',
    href: '/lab/cell-composition/configuration',
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

export default function CellCompositionTabs() {
  const theme = useAtomValue(themeAtom);
  const pathname = usePathname();
  const compositionLoadable = useAtomValue(loadable(cellCompositionAtom));
  const compositionHasChanged =
    compositionLoadable.state === 'hasData' && !compositionLoadable.data;

  return (
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
  );
}
