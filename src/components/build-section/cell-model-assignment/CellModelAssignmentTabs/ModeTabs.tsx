import { ReadOutlined } from '@ant-design/icons';

import { usePathname } from 'next/navigation';
import BrainIcon from '@/components/icons/Brain';
import AnalysisIcon from '@/components/icons/Analysis';
import SettingsIcon from '@/components/icons/Settings';
import { MenuItem } from '@/components/TopNavigation/types';
import TopNavigation from '@/components/TopNavigation';

const pathBase = '/build/cell-model-assignment';

export default function ModeTabs() {
  const pathName = usePathname();
  const tabSelected = pathName?.match(`${pathBase}/(.+?)/`)?.[1];
  const tabs: MenuItem[] = [
    {
      label: 'Interactive',
      href: `${pathBase}/${tabSelected}/interactive`,
      icon: <BrainIcon className="h-4" />,
    },
    {
      label: 'Analysis',
      href: `${pathBase}/${tabSelected}/analysis`,
      icon: <AnalysisIcon className="h-4" />,
    },
    {
      label: 'Configuration',
      href: `${pathBase}/${tabSelected}/configuration`,
      icon: <SettingsIcon className="h-4" />,
    },
    {
      label: 'Literature',
      href: `${pathBase}/${tabSelected}/literature`,
      icon: <ReadOutlined className="h-4 text-lg" />,
    },
  ];

  return <TopNavigation.SecondaryDropdown items={tabs} />;
}
