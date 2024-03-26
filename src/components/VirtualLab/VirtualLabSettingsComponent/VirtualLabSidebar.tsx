'use client';

import { usePathname } from 'next/navigation';
import { ConfigProvider, Select } from 'antd';
import { SwapOutlined } from '@ant-design/icons';

import VerticalLinks, { LinkItem } from '@/components/VerticalLinks';

export default function VirtualLabSidebar() {
  const currentPage = usePathname().split('/').pop();

  const virtualLabOptions: { value: string; label: string }[] = [
    { value: '1', label: 'Institute of Neuroscience' },
    { value: '2', label: 'Neural Blue Lab' },
  ];

  const linkItems: LinkItem[] = [
    { key: 'lab', content: 'The Virtual Lab', href: 'lab' },
    { key: 'projects', content: 'Projects', href: 'projects' },
    { key: 'team', content: 'Team', href: 'team' },
    { key: 'admin', content: 'Admin', href: 'admin' },
  ];
  return (
    <div className="mr-12 flex flex-col gap-5">
      <div className="text-5xl font-bold uppercase text-primary-5">Institute of Neuroscience</div>
      <ConfigProvider
        theme={{
          components: {
            Select: {
              colorBgContainer: '#002766',
              colorBgElevated: '#002766',
              colorBorder: '#0050B3',
              colorText: 'rgb(255, 255, 255)',
              optionSelectedBg: '#002766',
              borderRadius: 0,
              controlHeight: 40,
            },
          },
        }}
      >
        <Select
          suffixIcon={<SwapOutlined style={{ color: '#40A9FF' }} />}
          defaultValue="1"
          onChange={() => {}}
          options={virtualLabOptions}
        />
      </ConfigProvider>
      <VerticalLinks links={linkItems} currentPage={currentPage} />
    </div>
  );
}
