import BrainIcon from '@/components/icons/Brain';
import AnalysisIcon from '@/components/icons/Analysis';
import SettingsIcon from '@/components/icons/Settings';
import { MenuItem } from '@/components/TopNavigation/types';
import TopNavigation from '@/components/TopNavigation';

const tabs: MenuItem[] = [
  {
    label: 'Interactive',
    href: '/build/cell-model-assignment/m-model/interactive',
    icon: <BrainIcon className="h-4" />,
  },
  {
    label: 'Analysis',
    href: '/build/cell-model-assignment/m-model/analysis',
    icon: <AnalysisIcon className="h-4" />,
  },
  {
    label: 'Configuration',
    href: '/build/cell-model-assignment/m-model/configuration',
    icon: <SettingsIcon className="h-4" />,
  },
];

export default function ModeTabs() {
  return <TopNavigation.SecondaryDropdown items={tabs} />;
}
