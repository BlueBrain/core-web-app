import { unwrap } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import { CalendarOutlined, UserOutlined } from '@ant-design/icons';

import VirtualLabStatistic from '../VirtualLabStatistic';
import { MembersGroupIcon, StatsEditIcon } from '@/components/icons';
import Brain from '@/components/icons/Brain';
import { formatDate } from '@/util/utils';
import { virtualLabMembersAtomFamily } from '@/state/virtual-lab/lab';

type Props = {
  id: string;
  created_at: string;
};

export default function VirtualLabMainStatistics({ id, created_at }: Props) {
  const iconStyle = { color: '#69C0FF' };
  const virtualLabUsers = useAtomValue(unwrap(virtualLabMembersAtomFamily(id)));

  return (
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
        detail={virtualLabUsers?.length || 0}
      />
      <VirtualLabStatistic
        icon={<MembersGroupIcon style={iconStyle} />}
        title="Admin"
        detail={virtualLabUsers?.find((user) => user.role === 'admin')?.name || '-'}
      />
      <VirtualLabStatistic
        icon={<CalendarOutlined style={iconStyle} />}
        title="Creation date"
        detail={formatDate(created_at)}
      />
    </div>
  );
}
