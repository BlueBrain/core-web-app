'use client';

import { Collapse, ConfigProvider, Spin } from 'antd';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { PlusOutlined, MinusOutlined, LoadingOutlined } from '@ant-design/icons';
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
      <h4 className="text-primary-3">Projects</h4>
      <Collapse
        accordion
        expandIconPosition="end"
        expandIcon={ExpandIcon}
        bordered={false}
        items={virtualLabProjects.data?.results.map((project) => ({
          key: project.id,
          label: (
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold">{project.name}</h4>
              <div className="flex items-center gap-1 text-lg font-light">
                <span>Total spent: N/A</span>
                <span className="text-primary-3">out of</span>
                <span>{`$${project.budget}`}</span>
              </div>
            </div>
          ),
          children: (
            <div className="flex flex-col gap-2 text-white">
              <div className="font-medium uppercase">Completed jobs:</div>
              <div className="flex items-baseline gap-12">
                <div className="flex gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="items-center justify-center rounded bg-white p-2 font-mono text-primary-9">
                      N/A
                    </span>
                    <span className="font-light">Build</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="items-center justify-center rounded bg-white p-2 font-mono text-primary-9">
                      N/A
                    </span>
                    <span className="font-light">Simulate</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex gap-2">
                    Total compute:<span className="font-bold">6 core hours</span>
                  </span>
                  <span className="flex gap-2">
                    Total storage:<span className="font-bold">36GB</span>
                  </span>
                </div>
              </div>
            </div>
          ),
        }))}
      />
    </ConfigProvider>
  );
}
