import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Macro',
    children: null,
  },
  {
    key: '2',
    label: 'Micro',
    children: null,
  },
];

export default function GranularityTabs() {
  return <Tabs defaultActiveKey="1" items={items} moreIcon={null} size="small" animated={false} />;
}
