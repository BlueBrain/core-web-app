import { ReadOutlined } from '@ant-design/icons';

import BrainIcon from '@/components/icons/Brain';
import AnalysisIcon from '@/components/icons/Analysis';
import SettingsIcon from '@/components/icons/Settings';
import { MenuItem } from '@/components/TopNavigation/types';
import TopNavigation from '@/components/TopNavigation';

const tabs: MenuItem[] = [
  {
    label: 'Interactive',
    href: '/build/connectome-model-assignment/interactive',
    icon: <BrainIcon className="h-4" />,
  },
  {
    label: 'Analysis',
    href: '/build/connectome-model-assignment/analysis',
    icon: <AnalysisIcon className="h-4" />,
  },
  {
    label: 'Configuration',
    href: '/build/connectome-model-assignment/configuration',
    icon: <SettingsIcon className="h-4" />,
  },
  {
    label: 'Literature',
    href: '/build/literature',
    icon: <ReadOutlined className="w-5 text-lg" />,
  },
];

export default function ConnectomeModelAssignmentTabs() {
  return <TopNavigation.SecondaryDropdown items={tabs} />;
}
