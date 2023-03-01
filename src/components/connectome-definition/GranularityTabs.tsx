import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'MACRO',
    children: null,
  },
  {
    key: '2',
    label: 'MESO',
    children: null,
  },
  {
    key: '3',
    label: 'MICRO',
    children: null,
  },
];

export default function GranularityTabs() {
  return <Tabs defaultActiveKey="1" items={items} />;
}
