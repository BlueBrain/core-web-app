import { useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import VirtualLabProjectItem from '../projects/VirtualLabProjectList/VirtualLabProjectItem';
import VirtualLabBanner from '../VirtualLabBanner';
import VirtualLabMainStatistics from '../VirtualLabMainStatistics';
import { virtualLabProjectsAtomFamily } from '@/state/virtual-lab/projects';

type Props = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  showOnlyLabs: boolean;
};

export default function VirtualLabAndProject({
  id,
  name,
  description,
  createdAt,
  showOnlyLabs,
}: Props) {
  const projects = useAtomValue(loadable(virtualLabProjectsAtomFamily(id)));

  const renderProjects = useCallback(() => {
    if (projects.state === 'loading') {
      return <Spin indicator={<LoadingOutlined />} />;
    }
    if (projects.state === 'hasData') {
      return (
        <>
          {projects.data?.results && projects.data?.results.length > 0 && (
            <div className="font-bold uppercase text-primary-3">My Projects</div>
          )}
          {projects.data?.results.map((project) => (
            <VirtualLabProjectItem key={project.id} project={project} />
          ))}
        </>
      );
    }

    return null;
  }, [projects]);

  return (
    <div>
      <VirtualLabBanner
        id={id}
        name={name}
        description={description}
        withLink
        bottomElements={<VirtualLabMainStatistics id={id} created_at={createdAt} />}
      />
      {!showOnlyLabs && <div className="ml-20 mt-5 flex flex-col gap-5">{renderProjects()}</div>}
    </div>
  );
}
