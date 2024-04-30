'use client';

import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Switch } from 'antd';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { useCallback, useState } from 'react';

import VirtualLabAndProject from './VirtualLabAndProject';
import DashboardTotals from './DashboardTotals';
import { virtualLabsOfUserAtom } from '@/state/virtual-lab/lab';

export default function VirtualLabDashboard() {
  const virtualLabs = useAtomValue(loadable(virtualLabsOfUserAtom));
  const [showOnlyLabs, setShowOnlyLabs] = useState<boolean>(false);

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
          showOnlyLabs={showOnlyLabs}
        />
      ));
    }
    return null;
  }, [virtualLabs, showOnlyLabs]);

  return (
    <div className="inset-0 z-0 grid grid-cols-[1fr_4fr] grid-rows-1 bg-primary-9 text-white">
      <div className="mt-[25%] flex gap-3">
        <div>Show only virtual labs</div>
        <Switch
          value={showOnlyLabs}
          onChange={(value) => {
            setShowOnlyLabs(value);
          }}
        />
      </div>
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
