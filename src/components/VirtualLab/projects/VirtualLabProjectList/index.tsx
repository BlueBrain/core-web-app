'use client';

import { ConfigProvider } from 'antd';
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
              <input
                placeholder="Search for projects..."
                style={{ width: 300 }}
                className="border-b bg-transparent text-primary-3 outline-none"
              />
            </ConfigProvider>
          </div>
          <div>New Project</div>
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
