'use client';

import { ReactNode, Suspense, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Spin } from 'antd';
import { HomeOutlined, LoadingOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import VirtualLabTopMenu from '@/components/VirtualLab/VirtualLabTopMenu';
import VirtualLabSidebar from '@/components/VirtualLab/VirtualLabSidebar';
import { classNames } from '@/util/utils';
import { virtualLabDetailAtomFamily } from '@/state/virtual-lab/lab';
import style from './layout.module.scss';

export default function VirtualLabPageLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { virtualLabId: string };
}) {
  const virtualLab = useAtomValue(
    useMemo(() => unwrap(virtualLabDetailAtomFamily(params.virtualLabId)), [params.virtualLabId])
  );
  return (
    <div className="flex">
      <div className="flex h-screen w-[35px] flex-col items-center justify-between border-r border-primary-7">
        <div>
          <div className="mt-2 text-center text-2xl">+</div>
          <div className={classNames('mt-4 rotate-180 text-right', style.writingModeVertical)}>
            {!!virtualLab && (
              <span className="text-primary-2">
                Virtual lab: <span className="text-white">{virtualLab.name}</span>
              </span>
            )}
          </div>
        </div>
        <div className="mb-5">
          <HomeOutlined />
        </div>
      </div>
      <div className="inset-0 z-0 grid h-screen w-full grid-cols-[1fr_3fr] grid-rows-1 overflow-y-scroll bg-primary-9 p-10 text-white">
        <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
          <Suspense fallback={null}>
            <div className="flex flex-row gap-4">
              <VirtualLabSidebar virtualLabId={params.virtualLabId} />
            </div>
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
          <div className="ml-6">
            <Suspense fallback={<Spin indicator={<LoadingOutlined />} />}>
              <VirtualLabTopMenu />
              {children}
            </Suspense>
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
}
