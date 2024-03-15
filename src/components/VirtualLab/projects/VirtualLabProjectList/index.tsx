'use client';

import { ConfigProvider } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import VirtualLabProjectItem from './VirtualLabProjectItem';
import { mockProjects } from './mockData';

export default function VirtualLabProjectList() {
  const projects = mockProjects;

  return (
    <div className="my-5">
      <div className="flex flex-col gap-6">
        {/* Total + Search + Button row */}
        <div className="flex flex-row justify-between">
          {/* Total + Search */}
          <div className="flex flex-row items-center gap-5">
            <div className="flex gap-2">
              <span className="text-primary-3">Total projects</span>
              <span className="font-bold">{projects.length}</span>
            </div>
            <ConfigProvider
              theme={{
                components: {
                  Input: {
                    colorTextPlaceholder: '#69C0FF',
                    colorBgContainer: 'rgba(255,255,255,0)',
                  },
                  Button: {
                    colorPrimary: 'rgba(255,255,255,0)',
                  },
                },
              }}
            >
              <div className="flex w-[300px] justify-between border-b bg-transparent pb-[2px]">
                <input
                  placeholder="Search for projects..."
                  className="bg-transparent text-primary-3 outline-none placeholder:text-primary-3"
                />
                <SearchOutlined />
              </div>
            </ConfigProvider>
          </div>
          <div role="button" className="flex w-[200px] justify-between border border-primary-7 p-3">
            <span className="font-bold">New project</span>
            <PlusOutlined />
          </div>
        </div>
        {/* Projects row */}
        <div className="flex flex-col gap-4">
          {projects.map((project) => (
            <VirtualLabProjectItem key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
