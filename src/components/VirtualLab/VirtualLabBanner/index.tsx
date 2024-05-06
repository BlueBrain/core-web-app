import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import { CalendarOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'next/link';

import VirtualLabStatistic from '../VirtualLabStatistic';
import { virtualLabMembersAtomFamily } from '@/state/virtual-lab/lab';
import { basePath } from '@/config';
import { MembersGroupIcon, StatsEditIcon } from '@/components/icons';
import Brain from '@/components/icons/Brain';
import { formatDate } from '@/util/utils';
import { generateLabUrl } from '@/util/virtual-lab/urls';
import styles from './virtual-lab-banner.module.css';

type Props = {
  id: string;
  name: string;
  description: string;
  createdAt?: string;
  simulationExperiments?: string;
  buildModels?: string;
  withLink?: boolean;
  withEditButton?: boolean;
};

export default function VirtualLabBanner({
  name,
  description,
  createdAt,
  id,
  simulationExperiments,
  buildModels,
  withLink = false,
  withEditButton = false,
}: Props) {
  const users = useAtomValue(useMemo(() => unwrap(virtualLabMembersAtomFamily(id)), [id]));

  const iconStyle = { color: '#69C0FF' };
  const labUrl = generateLabUrl(id);

  return (
    <div className="relative flex min-h-[250px] flex-col justify-between gap-4 bg-primary-8 p-8">
      <div
        className={styles.bannerImg}
        style={{
          backgroundImage: `url(${basePath}/images/virtual-lab/obp_hippocampus_original.png)`,
        }}
      />
      <div className="z-[1000] flex flex-row justify-between">
        <div className="flex max-w-[70%] flex-col gap-2">
          <div>
            <div className="text-primary-2">Virtual Lab name</div>
            {withLink ? (
              <Link className="text-5xl font-bold" href={`${labUrl}/overview`}>
                {name}
              </Link>
            ) : (
              <div className="text-5xl font-bold">{name}</div>
            )}
          </div>
          <div>{description}</div>
        </div>
        {withEditButton && <EditOutlined />}
      </div>
      <div className="flex gap-5">
        {buildModels && (
          <VirtualLabStatistic
            icon={<Brain style={iconStyle} />}
            title="Builds"
            detail={buildModels}
          />
        )}

        {simulationExperiments && (
          <VirtualLabStatistic
            icon={<StatsEditIcon style={iconStyle} />}
            title="Simulation experiments"
            detail={simulationExperiments}
          />
        )}

        {users && (
          <VirtualLabStatistic
            icon={<UserOutlined style={iconStyle} />}
            title="Members"
            detail={users?.length || 0}
          />
        )}
        {users && (
          <VirtualLabStatistic
            icon={<MembersGroupIcon style={iconStyle} />}
            title="Admin"
            detail={users?.find((user) => user.role === 'admin')?.name || '-'}
          />
        )}
        {createdAt && (
          <VirtualLabStatistic
            icon={<CalendarOutlined style={iconStyle} />}
            title="Creation date"
            detail={formatDate(createdAt)}
          />
        )}
      </div>
    </div>
  );
}
