import { CalendarOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';

import VirtualLabStatistic from '../../VirtualLabStatistic';
import Brain from '@/components/icons/Brain';
import { EyeTargetIcon, MembersGroupIcon, StatsEditIcon } from '@/components/icons';
import { Project } from '@/types/virtual-lab/projects';
import { formatDate } from '@/util/utils';

type Props = {
  project: Project;
};

export default function VirtualLabProjectItem({ project }: Props) {
  const iconStyle = { color: '#69C0FF' };
  return (
    <div className="flex flex-col gap-3 rounded-md border border-primary-6 p-9 ">
      {/* Title row */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{project.name}</h2>

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
      {/* Description row */}
      <div className="max-w-[70%]">{project.description}</div>
      {/* Last row */}
      <div className="flex gap-5">
        <VirtualLabStatistic
          icon={<EyeTargetIcon style={iconStyle} />}
          title="Explore sessions"
          detail={350}
        />
        <VirtualLabStatistic icon={<Brain style={iconStyle} />} title="Builds" detail={18} />
        <VirtualLabStatistic
          icon={<StatsEditIcon style={iconStyle} />}
          title="Simulation experiments"
          detail={30}
        />
        <VirtualLabStatistic
          icon={<UserOutlined style={iconStyle} />}
          title="Members"
          detail="MEMBERS NOT RETRIEVED"
        />
        <VirtualLabStatistic
          icon={<MembersGroupIcon style={iconStyle} />}
          title="Admin"
          detail="ADMIN NOT RETRIEVED"
        />
        <VirtualLabStatistic
          icon={<CalendarOutlined style={iconStyle} />}
          title="Creation date"
          detail={formatDate(project.created_at)}
        />
      </div>
    </div>
  );
}
