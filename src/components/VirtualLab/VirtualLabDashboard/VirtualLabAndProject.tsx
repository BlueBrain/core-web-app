import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { Spin } from 'antd';
import { useCallback } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import VirtualLabBanner from '../VirtualLabBanner';
import { virtualLabProjectsAtomFamily } from '@/state/virtual-lab/projects';

type Props = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

export default function VirtualLabAndProject({ id, name, description, createdAt }: Props) {
  const projects = useAtomValue(loadable(virtualLabProjectsAtomFamily(id)));

  const renderProjects = useCallback(() => {
    if (projects.state === 'loading') {
      return <Spin indicator={<LoadingOutlined />} />;
    }
    if (projects.state === 'hasData') {
      return projects.data.results.map((project) => <div>project</div>);
    }

    return null;
  }, []);

  return (
    <div>
      <VirtualLabBanner
        id={id}
        name={name}
        description={description}
        createdAt={createdAt}
        withLink
      />
      <div className="ml-5">{renderProjects()}</div>
    </div>
  );
}
