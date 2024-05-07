'use client';

import { ReactNode, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import VirtualLabTopMenu from '@/components/VirtualLab/VirtualLabTopMenu';
import VirtualLabSidebar from '@/components/VirtualLab/VirtualLabSidebar';

export default function VirtualLabPageLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { virtualLabId: string };
}) {
  return (
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
  );
}
