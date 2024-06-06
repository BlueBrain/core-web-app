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
        icon={<Brain style={iconStyle} />}
        title="Explore resources"
        detail="N/A"
      />

      <VirtualLabStatistic
        icon={<StatsEditIcon style={iconStyle} />}
        title="Build models"
        detail="N/A"
      />
      <VirtualLabStatistic
        icon={<StatsEditIcon style={iconStyle} />}
        title="Simulation experiments"
        detail="N/A"
      />

      <VirtualLabStatistic
        icon={<UserOutlined style={iconStyle} />}
        title="Members"
        detail={<VirtualLabTotalUsers />}
      />
    </div>
  );
}

export default function VirtualLabSandboxHomePage() {
  return (
    <div className="mt-5 flex flex-col gap-5">
      <VirtualLabBanner
        id="test"
        name="Welcome to Blue Brain Open Platform"
        description="This is a space open to all interested in exploring the 3D atlas of the mouse brain at a scientific, biologically realistic, multiscale level. Here you can explore the datasets of single neurons, models, and in silico simulations prepared from experimental laboratories or developed over the past two decades by the Blue Brain Project and its collaborators. Whether you are an independent researcher or a neuroscience student without an institutional account, you can explore datasets and view models and simulations."
        bottomElements={<SandboxStatistics />}
        supertitle={null}
      />
      <VirtualLabCTABanner
        title="Create your virtual lab"
        subtitle="In order to start your own projects, explore brain regions, build different models and simulate"
      />
      <DiscoverObpPanel />
    </div>
  );
}
