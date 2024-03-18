import { ReactNode } from 'react';
import { CalendarOutlined, StarFilled, StarOutlined, UserOutlined } from '@ant-design/icons';

import { Project } from './types';
import Brain from '@/components/icons/Brain';
import { EyeTargetIcon, MembersGroupIcon, StatsEditIcon } from '@/components/icons';

type Props = {
  project: Project;
};

function ProjectDetail({
  icon,
  title,
  detail,
}: {
  icon: ReactNode;
  title: string;
  detail: number | string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <div>{icon}</div>
        <div className="text-primary-3">{title}</div>
      </div>

      <div className="font-bold">{detail}</div>
    </div>
  );
}

export default function VirtualLabProjectItem({ project }: Props) {
  const iconStyle = { color: '#69C0FF' };
  return (
    <div className="flex flex-col gap-3 rounded-md border border-primary-6 p-9 ">
      {/* Title row */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{project.title}</h2>

        <div className="flex items-center justify-between gap-6">
          <div className="flex gap-2">
            <span className="text-primary-3">Latest update</span>
            <span className="font-bold">{project.latestUpdate}</span>
          </div>
          <div className="flex">
            {project.isFavorite ? (
              <StarFilled style={{ fontSize: '18px', color: '#FFD465' }} />
            ) : (
              <StarOutlined style={{ fontSize: '18px' }} />
            )}
          </div>
        </div>
      </div>
      {/* Description row */}
      <div className="max-w-[70%]">{project.description}</div>
      {/* Last row */}
      <div className="flex gap-5">
        <ProjectDetail
          icon={<EyeTargetIcon style={iconStyle} />}
          title="Explore sessions"
          detail={project.exploreSessions}
        />
        <ProjectDetail icon={<Brain style={iconStyle} />} title="Builds" detail={project.builds} />
        <ProjectDetail
          icon={<StatsEditIcon style={iconStyle} />}
          title="Simulation experiments"
          detail={project.simulationExperiments}
        />
        <ProjectDetail
          icon={<UserOutlined style={iconStyle} />}
          title="Members"
          detail={project.members}
        />
        <ProjectDetail
          icon={<MembersGroupIcon style={iconStyle} />}
          title="Admin"
          detail={project.admin}
        />
        <ProjectDetail
          icon={<CalendarOutlined style={iconStyle} />}
          title="Creation date"
          detail={project.creationDate}
        />
      </div>
    </div>
  );
}
