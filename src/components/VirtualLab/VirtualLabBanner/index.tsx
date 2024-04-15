import { CalendarOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import VirtualLabStatistic from '../VirtualLabStatistic';
import { basePath } from '@/config';
import { MembersGroupIcon, StatsEditIcon } from '@/components/icons';
import Brain from '@/components/icons/Brain';
import { formatDate } from '@/util/utils';
import { VirtualLabMember } from '@/types/virtual-lab/members';
import Styles from './virtual-lab-banner.module.css';

type Props = {
  name: string;
  description: string;
  users?: VirtualLabMember[];
  createdAt: string;
};

export default function VirtualLabBanner({ name, description, users, createdAt }: Props) {
  const iconStyle = { color: '#69C0FF' };

  return (
    <div className="relative mt-10 flex min-h-[250px] flex-col justify-between gap-4 bg-primary-8 p-8">
      <div
        className={Styles.bannerImg}
        style={{
          backgroundImage: `url(${basePath}/images/virtual-lab/obp_hippocampus_original.png)`,
        }}
      />
      <div className="flex flex-row justify-between">
        <div className="flex max-w-[50%] flex-col gap-2">
          <div>
            <div className="text-primary-2">Virtual Lab name</div>
            <h2 className="text-5xl font-bold">{name}</h2>
          </div>
          <div>{description}</div>
        </div>
        <div>
          <EditOutlined />
        </div>
      </div>
      <div className="flex gap-5">
        <VirtualLabStatistic icon={<Brain style={iconStyle} />} title="Builds" detail="N/A" />
        <VirtualLabStatistic
          icon={<StatsEditIcon style={iconStyle} />}
          title="Simulation experiments"
          detail="N/A"
        />
        <VirtualLabStatistic
          icon={<UserOutlined style={iconStyle} />}
          title="Members"
          detail={users?.length || 0}
        />
        <VirtualLabStatistic
          icon={<MembersGroupIcon style={iconStyle} />}
          title="Admin"
          detail={users?.find((user) => user.role === 'admin')?.name || '-'}
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
