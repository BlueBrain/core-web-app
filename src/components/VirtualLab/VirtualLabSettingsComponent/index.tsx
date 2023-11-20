/* eslint-disable react/no-unstable-nested-components */

'use client';

import { Button, Collapse, ConfigProvider, Skeleton } from 'antd';
import { useRouter } from 'next/navigation';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';

import ComputeTimeVisualization from './ComputeTimeVisualization';
import { VirtualLab } from '@/services/virtual-lab/types';
import { getComputeTimeAtom } from '@/state/virtual-lab/lab';

type Props = {
  virtualLab: VirtualLab;
};

export default function VirtualLabSettingsComponent({ virtualLab }: Props) {
  const router = useRouter();
  const computeTimeAtom = useMemo(() => loadable(getComputeTimeAtom(virtualLab.id)), [virtualLab]);
  const computeTime = useAtomValue(computeTimeAtom);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorText: '#003A8C',
        },
        components: {
          Collapse: {
            headerBg: '#fff',
            headerPadding: '24px 28px',
          },
        },
      }}
    >
      <Button
        onClick={() => router.back()}
        type="text"
        className="flex items-center my-6 text-white"
      >
        <ArrowLeftOutlined /> Back to
      </Button>

      <div className="bg-primary-8">
        <div className="py-4 px-8 border border-transparent border-b-primary-7">
          <h6>Virtual lab</h6>
          <h3 className="font-bold text-3xl leading-10" data-testid="virtual-lab-name">
            {virtualLab.name}
          </h3>
        </div>
        <div className="py-4 px-8">
          <h5 className="font-bold">Compute hours current usage</h5>
          {computeTime.state === 'loading' && (
            <Skeleton paragraph={{ rows: 1 }} title={{ width: 0 }} />
          )}
          {computeTime.state === 'hasError' && (
            <p>There was an error while retrieving compute time.</p>
          )}
          {computeTime.state === 'hasData' && (
            <ComputeTimeVisualization
              usedTimeInHours={computeTime.data?.usedTimeInHours ?? 0}
              totalTimeInHours={computeTime.data?.totalTimeInHours ?? 0}
            />
          )}
        </div>
      </div>

      <Collapse
        expandIconPosition="end"
        expandIcon={() => <PlusOutlined style={{ fontSize: '14px' }} />}
        className="mt-4 rounded-none text-primary-8"
        items={[
          {
            key: 1,
            label: <h3 className="font-bold text-xl color-primary-8">Information</h3>,
            children: <p>Dummy information</p>,
          },
        ]}
      />

      <Collapse
        expandIconPosition="end"
        expandIcon={() => <PlusOutlined style={{ fontSize: '14px' }} />}
        className="mt-4 rounded-none text-primary-8"
        items={[
          {
            key: 1,
            label: <h3 className="font-bold text-xl color-primary-8">Members</h3>,
            children: <p>Dummy members</p>,
          },
        ]}
      />

      <Collapse
        expandIconPosition="end"
        expandIcon={() => <PlusOutlined style={{ fontSize: '14px' }} />}
        className="mt-4 rounded-none text-primary-8"
        items={[
          {
            key: 1,
            label: <h3 className="font-bold text-xl color-primary-8">Plan</h3>,
            children: <p>Dummy plan</p>,
          },
        ]}
      />
    </ConfigProvider>
  );
}