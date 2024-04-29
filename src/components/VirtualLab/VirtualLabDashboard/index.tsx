'use client';

import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { useCallback } from 'react';

import VirtualLabAndProject from './VirtualLabAndProject';
import DashboardTotals from './DashboardTotals';
import { virtualLabsOfUserAtom } from '@/state/virtual-lab/lab';

export default function VirtualLabDashboard() {
  const virtualLabs = useAtomValue(loadable(virtualLabsOfUserAtom));

  const renderVirtualLabs = useCallback(() => {
    if (virtualLabs.state === 'loading') {
      return <Spin indicator={<LoadingOutlined />} />;
    }
    if (virtualLabs.state === 'hasData') {
      return virtualLabs.data?.results.map((vl) => (
        <VirtualLabAndProject
          key={vl.id}
          id={vl.id}
          name={vl.name}
          description={vl.description}
          createdAt={vl.created_at}
        />
      ));
    }
    return null;
  }, [virtualLabs]);

  return (
    <div className="ml-[20%] bg-primary-9 text-white">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4">
          <div className="text-5xl font-bold uppercase">Your virtual labs and projects</div>
          <DashboardTotals />
        </div>
        {renderVirtualLabs()}
      </div>
    </div>
  );
}
