'use client';

import { CalendarOutlined, UserOutlined } from '@ant-design/icons';

import VirtualLabStatistic from '../VirtualLabStatistic';
import { MembersGroupIcon } from '@/components/icons';
import { formatDate } from '@/util/utils';

type Props = {
  admin?: string;
  createdAt?: string;
  userCount?: number | string;
};

export default function VirtualLabMainStatistics({ admin, createdAt, userCount }: Props) {
  const iconStyle = { color: '#69C0FF' };

  return (
    <div className="flex flex-wrap gap-5">
      {!!userCount && (
        <VirtualLabStatistic
          icon={<UserOutlined style={iconStyle} />}
          title="Members"
          detail={userCount}
        />
      )}

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
