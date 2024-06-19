'use client';

import { Spin } from 'antd';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';

import { LoadingOutlined } from '@ant-design/icons';
import VirtualLabMainStatistics from '../VirtualLabMainStatistics';
import { virtualLabsOfUserAtom } from '@/state/virtual-lab/lab';
import VirtualLabBanner from '@/components/VirtualLab/VirtualLabBanner';

export default function VirtualLabSelect() {
  const virtualLabs = useAtomValue(loadable(virtualLabsOfUserAtom));

  if (virtualLabs.state === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" indicator={<LoadingOutlined />} />
      </div>
    );
  }
  if (virtualLabs.state === 'hasError') {
    return <>Something went wrong when fetching virtual labs</>;
  }
  if (virtualLabs.data) {
    return (
      <div className="flex flex-col gap-5">
        {virtualLabs.data.results.map((vl) => {
          return (
            <VirtualLabBanner
              key={vl.id}
              id={vl.id}
              name={vl.name}
              description={vl.description}
              bottomElements={<VirtualLabMainStatistics id={vl.id} created_at={vl.created_at} />}
            />
          );
        })}
      </div>
    );
  }
  return null;
}
