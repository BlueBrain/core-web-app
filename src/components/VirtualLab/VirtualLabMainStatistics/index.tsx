'use client';

import { CalendarOutlined, UserOutlined } from '@ant-design/icons';

import VirtualLabStatistic from '../VirtualLabStatistic';
import { EyeTargetIcon, MembersGroupIcon, StatsEditIcon } from '@/components/icons';
import Brain from '@/components/icons/Brain';
import { formatDate } from '@/util/utils';

type Props = {
  admin?: string;
  createdAt?: string;
  sessions?: string;
  userCount?: number | string;
};

export default function VirtualLabMainStatistics({ admin, createdAt, sessions, userCount }: Props) {
  const iconStyle = { color: '#69C0FF' };

  return (
    <div className="flex flex-wrap gap-5">
      {!!sessions && (
        <VirtualLabStatistic
          icon={<EyeTargetIcon style={iconStyle} />}
          title="Explore sessions"
          detail={sessions}
        />
      )}
      <VirtualLabStatistic icon={<Brain style={iconStyle} />} title="Builds" detail="N/A" />
      <VirtualLabStatistic
        icon={<StatsEditIcon style={iconStyle} />}
        title="Simulation experiments"
        detail="N/A"
      />
      <VirtualLabStatistic
        icon={<UserOutlined style={iconStyle} />}
        title="Members"
        detail={userCount}
      />
      {!!admin && (
        <VirtualLabStatistic
          icon={<MembersGroupIcon style={iconStyle} />}
          title="Admin"
          detail={admin}
        />
      )}
      {createdAt && (
        <VirtualLabStatistic
          icon={<CalendarOutlined style={iconStyle} />}
          title="Creation date"
          detail={createdAt && formatDate(createdAt)}
        />
      )}
    </div>
  );
}
