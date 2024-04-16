import { CalendarOutlined, UserOutlined } from '@ant-design/icons';

import VirtualLabStatistic from '../../VirtualLabStatistic';
import { EyeTargetIcon, MembersGroupIcon, StatsEditIcon } from '@/components/icons';
import Brain from '@/components/icons/Brain';
import { basePath } from '@/config';
import { formatDate } from '@/util/utils';
import { VirtualLabMember } from '@/types/virtual-lab/members';

type Props = {
  name: string;
  description: string;
  ownerName: string;
  createdAt: string;
  users: VirtualLabMember[];
};

export default function VirtualLabProjectBanner({
  name,
  description,
  ownerName,
  createdAt,
  users,
}: Props) {
  const iconStyle = { color: '#69C0FF' };

  return (
    <div className="relative mt-10 flex min-h-[250px] flex-col justify-between gap-4 overflow-hidden bg-primary-8 p-8">
      <div
        className="absolute right-[-150px] top-[-220px] h-[500px] w-[500px]  rotate-[-135deg] transform  bg-cover bg-left-top bg-right-top bg-no-repeat"
        style={{
          backgroundImage: `url(${basePath}/images/virtual-lab/obp_neocortex.png)`,
        }}
      />
      <div className="flex flex-row justify-between">
        <div className="flex max-w-[50%] flex-col gap-2">
          <div>
            <div className="text-primary-2">Name</div>
            <h2 className="text-4xl font-bold">{name}</h2>
          </div>
          <div>{description}</div>
        </div>
      </div>
      <div className="flex gap-5">
        <VirtualLabStatistic
          icon={<EyeTargetIcon style={iconStyle} />}
          title="Explore sessions"
          detail="N/A"
        />
        <VirtualLabStatistic icon={<Brain style={iconStyle} />} title="Builds" detail="N/A" />
        <VirtualLabStatistic
          icon={<StatsEditIcon style={iconStyle} />}
          title="Simulation Experiments"
          detail="N/A"
        />
        <VirtualLabStatistic
          icon={<UserOutlined style={iconStyle} />}
          title="Members"
          detail={users.length}
        />
        <VirtualLabStatistic
          icon={<MembersGroupIcon style={iconStyle} />}
          title="Admin"
          detail={ownerName}
        />
        <VirtualLabStatistic
          icon={<CalendarOutlined style={iconStyle} />}
          title="Creation date"
          detail={formatDate(createdAt)}
        />
      </div>
    </div>
  );
}
