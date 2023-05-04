import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

const items: TabsProps['items'] = [
  {
    key: 'macro',
    label: 'Macro',
    children: null,
  },
  {
    key: 'micro',
    label: 'Micro',
    children: null,
  },
];

export default function GranularityTabs({ handleChange }: { handleChange: (key: string) => void }) {
  return (
    <Tabs
      defaultActiveKey="macro"
      items={items}
      moreIcon={null}
      size="small"
      animated={false}
      onChange={handleChange}
    />
  );
}
