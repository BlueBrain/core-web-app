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
    <div className="flex h-screen w-full overflow-y-scroll bg-primary-9 p-8 text-white">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <Suspense fallback={null}>
          <div className="flex w-1/3 flex-row gap-4">
            <VirtualLabSidebar virtualLabId={params.virtualLabId} />
          </div>
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="ml-6 w-2/3">
          <Suspense fallback={<Spin indicator={<LoadingOutlined />} />}>
            <VirtualLabTopMenu />
            {children}
          </Suspense>
        </div>
      </ErrorBoundary>
    </div>
  );
}
