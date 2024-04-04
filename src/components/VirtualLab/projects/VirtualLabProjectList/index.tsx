'use client';

import { Collapse, ConfigProvider } from 'antd';
import { PlusOutlined, SearchOutlined, MinusOutlined } from '@ant-design/icons';
import VirtualLabProjectItem from './VirtualLabProjectItem';
import { mockProjects } from '@/components/VirtualLab/mockData/projects';

// TODO: Consolodate this with the ExpandIcon in @/components/VirtualLab/VirtualLabSettingsComponent
function ExpandIcon({ isActive }: { isActive?: boolean }) {
  return isActive ? (
    <MinusOutlined style={{ fontSize: '14px' }} />
  ) : (
    <PlusOutlined style={{ fontSize: '14px' }} />
  );
}

export function AdminPanelProjectList() {
  const projects = mockProjects;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorText: '#fff',
        },
        components: {
          Collapse: {
            headerPadding: '20px 0',
            contentPadding: '20px',
            // contentBg: '#002766',
            colorBorder: '#69C0FF',
          },
        },
      }}
    >
      <Collapse
        accordion
        expandIconPosition="end"
        expandIcon={ExpandIcon}
        className="font-bold"
        bordered={false}
        items={projects.map((project) => ({
          key: project.id,
          label: (
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold">{project.title}</h4>
              <div className="flex items-center gap-1 text-lg font-light">
                <span>{project.budget.totalSpent}</span>
                <span className="text-primary-3">out of</span>
                <span>{project.budget.total}</span>
              </div>
            </div>
          ),
          children: (
            <div className="flex flex-col gap-2 text-white">
              <div className="font-medium uppercase">Completed jobs:</div>
              <div className="flex gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="items-center justify-center rounded bg-white p-2 font-mono text-primary-9">
                    {project.builds}
                  </span>
                  <span className="font-light">Build</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="items-center justify-center rounded bg-white p-2 font-mono text-primary-9">
                    {project.simulationExperiments}
                  </span>
                  <span className="font-light">Simulate</span>
                </div>
              </div>
            </div>
          ),
        }))}
      />
    </ConfigProvider>
  );
}

// TODO: Remove this component (I don't think it's being used anywhere)
export default function VirtualLabProjectList() {
  const projects = mockProjects;

  return (
    <div className="my-5">
      <div className="flex flex-col gap-6">
        {/* Total + Search + Button row */}
        <div className="flex flex-row justify-between">
          {/* Total + Search */}
          <div className="flex flex-row items-center gap-8">
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
