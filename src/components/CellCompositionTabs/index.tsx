import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';

import BrainIcon from '@/components/icons/Brain';
import AnalysisIcon from '@/components/icons/Analysis';
import SettingsIcon from '@/components/icons/Settings';
import { cellCompositionAtom } from '@/state/brain-model-config/cell-composition';
import TopNavigation from '@/components/TopNavigation';
import { MenuItem } from '@/components/TopNavigation/types';

const DEFAULT_TABS: MenuItem[] = [
  {
    label: 'Interactive',
    href: '/build/cell-composition/interactive',
    icon: <BrainIcon className="h-4" />,
  },
  {
    label: 'Analysis',
    href: '/build/cell-composition/analysis',
    icon: <AnalysisIcon className="h-4" />,
  },
  {
    label: 'Configuration',
    href: '/build/cell-composition/configuration/macro',
    icon: <SettingsIcon className="h-4" />,
  },
];

const DISABLE_ON_CHANGE_TABS = ['Analysis'];

export default function CellCompositionTabs() {
  const compositionLoadable = useAtomValue(loadable(cellCompositionAtom));
  const compositionHasChanged =
    compositionLoadable.state === 'hasData' && !compositionLoadable.data;

  const tabs = useMemo(
    () =>
      DEFAULT_TABS.filter(
        (tab) => !compositionHasChanged || !DISABLE_ON_CHANGE_TABS.includes(tab.label)
      ),
    [compositionHasChanged]
  );

  return <TopNavigation.SecondaryDropdown items={tabs} />;
}
