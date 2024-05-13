'use client';

import { LoadingOutlined, UserOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { Spin } from 'antd';

import DiscoverObpPanel from '@/components/VirtualLab/DiscoverObpPanel';
import VirtualLabBanner from '@/components/VirtualLab/VirtualLabBanner';
import VirtualLabCTABanner from '@/components/VirtualLab/VirtualLabCTABanner';
import VirtualLabStatistic from '@/components/VirtualLab/VirtualLabStatistic';
import { StatsEditIcon } from '@/components/icons';
import Brain from '@/components/icons/Brain';
import { virtualLabTotalUsersAtom } from '@/state/virtual-lab/users';

function VirtualLabTotalUsers() {
  const totalUsers = useAtomValue(loadable(virtualLabTotalUsersAtom));

  if (totalUsers.state === 'loading') {
    return <Spin indicator={<LoadingOutlined />} />;
  }

  if (totalUsers.state === 'hasData') {
    return totalUsers.data;
  }
  return null;
}

function SandboxStatistics() {
  const iconStyle = { color: '#69C0FF' };
  return (
    <div className="flex gap-5">
      <VirtualLabStatistic
        key="1"
        icon={<Brain style={iconStyle} />}
        title="Explore resources"
        detail="N/A"
      />

      <VirtualLabStatistic
        key="2"
        icon={<StatsEditIcon style={iconStyle} />}
        title="Build models"
        detail="N/A"
      />
      <VirtualLabStatistic
        key="3"
        icon={<StatsEditIcon style={iconStyle} />}
        title="Simulation experiments"
        detail="N/A"
      />

      <VirtualLabStatistic
        key="2"
        icon={<UserOutlined style={iconStyle} />}
        title="Members"
        detail={<VirtualLabTotalUsers />}
      />
      <VirtualLabCTABanner />
      <DiscoverObpPanel />
    </div>
  );
}

export default function VirtualLabSandboxHomePage() {
  return (
    <div className="mt-5 flex flex-col gap-5">
      <VirtualLabBanner
        id="test"
        name="Welcome to Open Brain Platform"
        description="Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Aenean lacinia bibendum nulla sed consectetur. Donec id elit non mi porta gravida at eget metus. Vestibulum id ligula porta felis euismod semper. Maecenas faucibus mollis interdum."
        bottomElements={<SandboxStatistics />}
        supertitle={null}
      />
      <VirtualLabCTABanner
        title="Create your virtual lab"
        subtitle="In order to start your own projects, explore brain regions, build different models and simulate"
      />
      <DiscoverObpPanel />
      <div className="flex justify-end">
        <CreateVirtualLabButton extraClasses="bg-white rounded-none text-primary-8" key={2} />
      </div>
    </div>
  );
}
