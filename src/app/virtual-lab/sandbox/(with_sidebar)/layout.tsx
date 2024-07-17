'use client';

import { ReactNode, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import VirtualLabTopMenu from '@/components/VirtualLab/VirtualLabTopMenu';
import { OBPLogo } from '@/components/Entrypoint/segments/Splash';

export default function VirtualLabSandboxLayout({ children }: { children: ReactNode }) {
  return (
    <div className="inset-0 z-0 grid h-screen grid-cols-[1fr_3fr] grid-rows-1 overflow-y-scroll bg-primary-9 p-10 text-white">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <Suspense fallback={null}>
          <div className="flex flex-col gap-4">
            <OBPLogo color="text-white" />
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
