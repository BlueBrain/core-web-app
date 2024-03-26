import { usePathname } from 'next/navigation';

import { ConfigProvider, Select } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { mockProjects } from '../../mockData/projects';
import VerticalLinks, { LinkItem } from '@/components/VerticalLinks';

export default function VirtualLabProjectSidebar() {
  const currentPage = usePathname().split('/').pop();
  const projectOptions = mockProjects.map((project) => ({
    value: project.id,
    label: project.title,
  }));

  const linkItems: LinkItem[] = [
    { key: 'home', content: 'Project Home', href: 'home' },
    { key: 'library', content: 'Project Library', href: 'library' },
    { key: 'team', content: 'Project Team', href: 'team' },
    { key: 'explore', content: 'Explore', href: 'explore' },
    { key: 'build', content: 'Build', href: 'build' },
    { key: 'simulate', content: 'Simulate', href: 'simulate' },
  ];
  return (
    <div className="mt-10 flex flex-col gap-5">
      <h1 className="leading-12 text-5xl font-bold uppercase text-primary-5">
        Thalamus <br />
        Exploration <br />
        Project 1
      </h1>
      <ConfigProvider
        theme={{
          components: {
            Select: {
              colorBgContainer: '#002766',
              colorBgElevated: '#002766',
              colorBorder: '#0050B3',
              colorText: '#69C0FF',
              optionSelectedBg: '#002766',
              borderRadius: 0,
              controlHeight: 40,
            },
          },
        }}
      >
        <Select
          suffixIcon={<SwapOutlined style={{ color: '#40A9FF' }} />}
          defaultValue={projectOptions[0].value}
          onChange={() => {}}
          options={projectOptions}
        />
      </ConfigProvider>

      <VerticalLinks links={linkItems} currentPage={currentPage} />
    </div>
  );
}
