'use client';

import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';

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

  return virtualLabs.data.results.map((vl) => (
    <VirtualLabBanner
      key={vl.id}
      id={vl.id}
      name={vl.name}
      description={vl.description}
      users={vl.users}
      createdAt={vl.created_at}
      withLink
    />
  ));
}
