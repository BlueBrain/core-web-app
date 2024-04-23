import { CalendarOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';
// import Link from 'next/link';

import VirtualLabStatistic from '../../VirtualLabStatistic';
import Brain from '@/components/icons/Brain';
import { EyeTargetIcon, MembersGroupIcon, StatsEditIcon } from '@/components/icons';
import { Project } from '@/types/virtual-lab/projects';
import { formatDate } from '@/util/utils';

function ProjectStats({ project }: { project: Project }) {
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
          detail: 'MEMBERS NOT RETRIEVED',
          icon: <UserOutlined style={iconStyle} />,
          key: 'members',
          title: 'Members',
        },
        {
          detail: 'ADMIN NOT RETRIEVED',
          icon: <MembersGroupIcon style={iconStyle} />,
          key: 'admin',
          title: 'Admin',
        },
        {
          detail: formatDate(project.created_at),
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
  return (
    <div className="flex flex-col gap-3 rounded-md border border-primary-6 p-9">
      <div className="flex items-center justify-between">
        {/* Temporarily removing this until Dinika updates the response for POST requests
        <Link
          className="text-2xl font-bold"
          href={`/virtual-lab/lab/${project.virtual_lab_id}/project/${project.id}/home`}
        >
          {project.name}
        </Link>
        */}
        <div className="flex items-center justify-between gap-6">
          <div className="flex gap-2">
            <span className="text-primary-3">Latest update</span>
            <span className="font-bold">{formatDate(project.updated_at)}</span>
          </div>
          <div className="flex">
            {/* {project.isFavorite ? (
              <StarFilled style={{ fontSize: '18px', color: '#FFD465' }} />
            ) : ( */}
            {/* TODO: we dont have a favorite functionality yet */}
            <StarOutlined style={{ fontSize: '18px' }} />
            {/* )} */}
          </div>
        </div>
      </div>
      <h3 className="text-4xl font-bold">{project.name}</h3>
      <p>{project.description}</p>
      <ProjectStats project={project} />
    </div>
  );
}
