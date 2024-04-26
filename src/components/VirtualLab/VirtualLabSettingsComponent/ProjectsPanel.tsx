import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { Collapse, ConfigProvider, Spin } from 'antd';
import { CollapseProps } from 'antd/lib/collapse/Collapse';
import { LoadingOutlined } from '@ant-design/icons';

import { virtualLabProjectsAtomFamily } from '@/state/virtual-lab/projects';

function ItemHeader({ budget, name }: { budget: number; name: string }) {
  return (
    <div className="flex items-center justify-between">
      <h4 className="text-xl font-bold">{name}</h4>
      <div className="flex items-center gap-1 text-lg font-light">
        <span>Total spent: N/A</span>
        <span className="text-primary-3">out of</span>
        <span>{`$${budget}`}</span>
      </div>
    </div>
  );
}

function ItemChildren() {
  return (
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
  );
}

function ProjectsCollapse({ expandIcon, items }: CollapseProps) {
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
        expandIcon={expandIcon}
        bordered={false}
        items={items}
      />
    </ConfigProvider>
  );
}

export default function ProjectsPanel({
  expandIcon,
  virtualLabId,
}: {
  expandIcon: CollapseProps['expandIcon'];
  virtualLabId: string;
}) {
  const virtualLabProjects = useAtomValue(loadable(virtualLabProjectsAtomFamily(virtualLabId)));

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

  const items = virtualLabProjects.data?.results.map((project) => ({
    label: <ItemHeader budget={project.budget} key={project.id} name={project.name} />,
    children: <ItemChildren />,
  }));

  return <ProjectsCollapse expandIcon={expandIcon} items={items} />;
}
