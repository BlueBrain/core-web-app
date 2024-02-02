import { useMemo } from 'react';
import { parseAsString, useQueryState } from 'nuqs';
import { Menu } from 'antd';
import { MenuProps } from 'antd/es/menu';

export type EmodelTabKeys = 'configuration' | 'analysis' | 'simulation';
export const EMODEL_TABS: Array<{ key: EmodelTabKeys; title: string }> = [
  {
    key: 'configuration',
    title: 'Configuration',
  },
  {
    key: 'analysis',
    title: 'Analysis',
  },
  {
    key: 'simulation',
    title: 'Simulation',
  },
];

export default function Tabs() {
  const [activeTab, setActiveTab] = useQueryState(
    'tab',
    parseAsString.withDefault(EMODEL_TABS.at(0)!.key)
  );
  const items = useMemo(
    () =>
      EMODEL_TABS.map((item) => ({
        key: item.key,
        title: item.title,
        label: item.title,
        className: 'text-center font-semibold !flex-[1_1_30%]',
        style: {
          backgroundColor: activeTab === item.key ? '#002766' : 'white',
          color: activeTab === item.key ? 'white' : '#002766',
        },
      })),
    [activeTab]
  );

  const onClick: MenuProps['onClick'] = ({ key, domEvent }) => {
    domEvent.preventDefault();
    domEvent.stopPropagation();
    setActiveTab(key);
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[activeTab]}
      mode="horizontal"
      theme="dark"
      className="flex w-full justify-start"
      items={items}
    />
  );
}
