import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { Collapse, ConfigProvider, Spin } from 'antd';
import { RightOutlined, ArrowRightOutlined, LoadingOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { virtualLabProjectsAtomFamily } from '@/state/virtual-lab/projects';
import { virtualLabsOfUserAtom } from '@/state/virtual-lab/lab';

function VirtualLabProjects({ labId }: { labId: string }) {
  const virtualLabProjectsLoadable = useAtomValue(loadable(virtualLabProjectsAtomFamily(labId)));

  if (virtualLabProjectsLoadable.state === 'hasData') {
    return (
      <div className="w-[16.1rem]">
        <h1 className="text-md mb-2 font-thin uppercase text-primary-4">Projects</h1>
        {virtualLabProjectsLoadable.data.results.map((project) => (
          <Link
            href={`/virtual-lab/lab/${labId}/project/${project.id}/home`}
            key={project.id}
            className="flex items-center justify-between text-lg font-semibold text-white"
          >
            <span>{project.name}</span>
            <ArrowRightOutlined className="text-sm font-thin text-primary-3" />
          </Link>
        ))}
      </div>
    );
  }

  // Handle loading and error states as needed
  return null;
}

const headerStyle = {
  backgroundImage: `linear-gradient(rgba(9, 109, 217, 0.5), rgba(9, 109, 217, 0.5)), url(/images/explore/explore_home_bgImg-01.jpg)`,
  backgroundColor: '#096DD9',
  backgroundSize: 'cover',
  padding: '1rem 1.5rem 1rem 0.5rem',
  borderRadius: '0.2rem',
};

function ExpandIcon({ isActive }: { isActive?: boolean }) {
  return (
    <RightOutlined
      rotate={isActive ? 90 : 0}
      className="relative right-[2.2rem] top-2/3"
      style={{ color: 'white' }}
    />
  );
}
export default function LabsAndProjectsCollapse() {
  const virtualLabsLoadable = useAtomValue(loadable(virtualLabsOfUserAtom));

  if (virtualLabsLoadable.state === 'loading') {
    return <Spin indicator={<LoadingOutlined />} />;
  }

  if (virtualLabsLoadable.state === 'hasData') {
    const items = virtualLabsLoadable.data.results.map((lab) => ({
      key: lab.id,
      header: (
        <h3 className="w-[17.5rem] truncate text-xl font-semibold text-white" style={headerStyle}>
          {lab.name}
        </h3>
      ),
      name: lab.name,
      children: <VirtualLabProjects labId={lab.id} />,
    }));

    return (
      <ConfigProvider
        theme={{
          token: {
            colorText: '#003A8C',
          },
          components: {
            Collapse: {
              headerBg: 'transparent',
              headerPadding: '20px 0px',
            },
          },
        }}
      >
        <Collapse
          bordered={false}
          ghost
          expandIconPosition="end"
          className="w-full"
          expandIcon={ExpandIcon}
        >
          {items.map((item) => (
            <Collapse.Panel key={item.key} header={item.header}>
              {item.children}
            </Collapse.Panel>
          ))}
        </Collapse>
      </ConfigProvider>
    );
  }

  // Handle loading and error states as needed
  return null;
}
