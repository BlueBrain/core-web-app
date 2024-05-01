import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { Spin } from 'antd';
import { useCallback } from 'react';
import { LoadingOutlined } from '@ant-design/icons';

import VirtualLabProjectItem from '../projects/VirtualLabProjectList/VirtualLabProjectItem';
import VirtualLabBanner from '../VirtualLabBanner';
import { virtualLabProjectsAtomFamily } from '@/state/virtual-lab/projects';
import { VirtualLabMember } from '@/types/virtual-lab/members';

type Props = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  users: VirtualLabMember[];
  showOnlyLabs: boolean;
};

export default function VirtualLabAndProject({
  id,
  name,
  description,
  createdAt,
  users,
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
        createdAt={createdAt}
        users={users}
        withLink
      />
      {!showOnlyLabs && <div className="ml-20 mt-5 flex flex-col gap-5">{renderProjects()}</div>}
    </div>
  );
}
