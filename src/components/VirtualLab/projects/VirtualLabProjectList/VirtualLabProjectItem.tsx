import { CalendarOutlined, LoadingOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { loadable, unwrap } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import { Spin } from 'antd';

import VirtualLabStatistic from '../../VirtualLabStatistic';
import Brain from '@/components/icons/Brain';
import { EyeTargetIcon, MembersGroupIcon, StatsEditIcon } from '@/components/icons';
import { Project } from '@/types/virtual-lab/projects';
import { formatDate } from '@/util/utils';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';
import { virtualLabProjectUsersAtomFamily } from '@/state/virtual-lab/projects';

function MemberAmount({ virtualLabId, projectId }: { virtualLabId: string; projectId: string }) {
  const users = useAtomValue(
    loadable(virtualLabProjectUsersAtomFamily({ virtualLabId, projectId }))
  );

  if (users.state === 'loading') {
    return <Spin indicator={<LoadingOutlined />} />;
  }
  if (users.state === 'hasError') {
    return '-';
  }
  return users.data?.length || '-';
}

function ProjectStats({ project }: { project: Project }) {
  const { created_at: createdAt, id: projectId, virtual_lab_id: virtualLabId } = project;

  const projectUsers = useAtomValue(
    unwrap(
      virtualLabProjectUsersAtomFamily({
        virtualLabId,
        projectId,
      })
    )
  );

  const iconStyle = { color: '#69C0FF' };

  return (
    <div className="flex flex-wrap gap-5">
      {[
        {
          detail: 'N/A',
          icon: <EyeTargetIcon style={iconStyle} />,
          key: 'explore-sessions',
          title: 'Explore sessions',
        },
        {
          detail: 'N/A',
          icon: <Brain style={iconStyle} />,
          key: 'builds',
          title: 'Builds',
        },
        {
          detail: 'N/A',
          icon: <StatsEditIcon style={iconStyle} />,
          key: 'simulation=experiments',
          title: 'Simulation experiments',
        },
        {
          detail: <MemberAmount virtualLabId={virtualLabId} projectId={projectId} />,
          icon: <UserOutlined style={iconStyle} />,
          key: 'members',
          title: 'Members',
        },
        {
          detail: projectUsers?.find(({ role }) => role === 'admin')?.name,
          icon: <MembersGroupIcon style={iconStyle} />,
          key: 'admin',
          title: 'Admin',
        },
        {
          detail: formatDate(createdAt),
          icon: <CalendarOutlined style={iconStyle} />,
          key: 'creation-date',
          title: 'Creation date',
        },
      ].map(({ detail, icon, key, title }) => (
        <VirtualLabStatistic detail={detail} icon={icon} key={key} title={title} />
      ))}
    </div>
  );
}

export default function VirtualLabProjectItem({ project }: { project: Project }) {
  const projectUrl = generateVlProjectUrl(project.virtual_lab_id, project.id);

  return (
    <Link
      className="flex flex-col gap-3 rounded-md border border-primary-6 p-9"
      href={`${projectUrl}/home`}
    >
      <div className="flex items-start justify-between">
        <h3 className="text-4xl font-bold">{project.name}</h3>
        <div className="flex gap-2">
          <span className="text-primary-3">Latest update</span>
          <span className="font-bold">{formatDate(project.updated_at)}</span>
        </div>
      </div>
      <p>{project.description}</p>
      <ProjectStats project={project} />
    </Link>
  );
}
