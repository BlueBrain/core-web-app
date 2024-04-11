'use client';

import { Collapse, ConfigProvider, Spin } from 'antd';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { PlusOutlined, SearchOutlined, MinusOutlined, LoadingOutlined } from '@ant-design/icons';
import VirtualLabProjectItem from './VirtualLabProjectItem';
import { virtualLabProjectsAtomFamily } from '@/state/virtual-lab/projects';

// TODO: Consolodate this with the ExpandIcon in @/components/VirtualLab/VirtualLabSettingsComponent
function ExpandIcon({ isActive }: { isActive?: boolean }) {
  return isActive ? (
    <MinusOutlined style={{ fontSize: '14px' }} />
  ) : (
    <PlusOutlined style={{ fontSize: '14px' }} />
  );
}

type Props = {
  id: string;
};

export function AdminPanelProjectList({ id }: Props) {
  const virtualLabProjects = useAtomValue(loadable(virtualLabProjectsAtomFamily(id)));
  if (virtualLabProjects.state === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" indicator={<LoadingOutlined />} />
      </div>
    );
  }

  if (virtualLabProjects.state === 'hasError') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg border p-8">Something went wrong when fetching projects</div>
      </div>
    );
  }

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
            colorBorder: '#69C0FF',
          },
        },
      }}
    >
      <Collapse
        accordion
        expandIconPosition="end"
        expandIcon={ExpandIcon}
        className="px-[28px] font-bold"
        bordered={false}
        items={virtualLabProjects.data?.results.map((project) => ({
          key: project.id,
          label: (
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold">{project.name}</h4>
              <div className="flex items-center gap-1 text-lg font-light">
                <span>350</span>
                <span className="text-primary-3">out of</span>
                <span>{project.budget}</span>
              </div>
            </div>
          ),
          children: (
            <div className="flex flex-col gap-2 text-white">
              <div className="font-medium uppercase">Completed jobs:</div>
              <div className="flex gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="items-center justify-center rounded bg-white p-2 font-mono text-primary-9">
                    18
                  </span>
                  <span className="font-light">Build</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="items-center justify-center rounded bg-white p-2 font-mono text-primary-9">
                    350
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
export default function VirtualLabProjectList({ id }: Props) {
  const virtualLabProjects = useAtomValue(loadable(virtualLabProjectsAtomFamily(id)));
  if (virtualLabProjects.state === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" indicator={<LoadingOutlined />} />
      </div>
    );
  }

  if (virtualLabProjects.state === 'hasError') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg border p-8">Something went wrong when fetching projects</div>
      </div>
    );
  }

  return (
    <div className="my-5">
      <div className="flex flex-col gap-6">
        {/* Total + Search + Button row */}
        <div className="flex flex-row justify-between">
          {/* Total + Search */}
          <div className="flex flex-row items-center gap-8">
            <div className="flex gap-2">
              <span className="text-primary-3">Total projects</span>
              <span className="font-bold">{virtualLabProjects.data?.results.length}</span>
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
          {virtualLabProjects.data?.results.map((project) => (
            <VirtualLabProjectItem key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
