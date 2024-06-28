'use client';

import { ReactNode, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { usePathname } from 'next/navigation';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import VirtualLabTopMenu from '@/components/VirtualLab/VirtualLabTopMenu';
import VerticalLinks, { LinkItem } from '@/components/VerticalLinks';
import { LinkItemKey } from '@/constants/virtual-labs/sidemenu';
import { OBPLogo } from '@/components/Entrypoint/segments/Splash';
import CreateVirtualLabButton from '@/components/VirtualLab/CreateVirtualLabButton';

export default function VirtualLabSandboxLayout({ children }: { children: ReactNode }) {
  const currentPage = usePathname().split('/').pop();

  const linkItems: LinkItem[] = [
    { key: LinkItemKey.Home, content: 'Home', href: 'home' },
    { key: LinkItemKey.Explore, content: 'Explore', href: 'explore' },
    { key: LinkItemKey.Build, content: 'Build', href: 'build' },
    { key: LinkItemKey.Simulate, content: 'Simulate', href: 'simulate' },
  ];

  return (
    <div className="inset-0 z-0 grid h-screen grid-cols-[1fr_3fr] grid-rows-1 overflow-y-scroll bg-primary-9 p-10 text-white">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <Suspense fallback={null}>
          <div className="flex flex-col gap-4">
            <OBPLogo color="text-white" />
            <VerticalLinks links={linkItems} currentPage={currentPage} />
          </div>
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="ml-6">
          <Suspense fallback={<Spin indicator={<LoadingOutlined />} />}>
            <VirtualLabTopMenu />
            {children}
            <div className="fixed bottom-0 right-0 m-5 flex justify-end">
              <CreateVirtualLabButton />
            </div>
          </Suspense>
        </div>
      </ErrorBoundary>
    </div>
  );
}
