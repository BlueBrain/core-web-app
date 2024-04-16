'use client';

import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { useCallback } from 'react';

import VirtualLabAndProject from './VirtualLabAndProject';
import { virtualLabsOfUserAtom } from '@/state/virtual-lab/lab';

export default function VirtualLabDashboard() {
  const virtualLabs = useAtomValue(loadable(virtualLabsOfUserAtom));

  const renderVirtualLabs = useCallback(() => {
    if (virtualLabs.state === 'loading') {
      return <Spin indicator={<LoadingOutlined />} />;
    }
    if (virtualLabs.state === 'hasData') {
      return virtualLabs.data.results.map((vl) => (
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
    <div className="inset-0 z-0 grid h-screen grid-cols-[1fr_4fr] grid-rows-1 overflow-y-scroll bg-primary-9 text-white">
      <div className="flex flex-col gap-4 text-primary-5">
        <div className="text-5xl font-bold uppercase">Your virtual labs and projects</div>
        <div className="flex flex-col">
          <div>Total labs: N/A</div>
          <div>Total projects: N/A</div>
        </div>
      </div>

      <div className="flex flex-col gap-5">{renderVirtualLabs()}</div>
    </div>
  );
}
