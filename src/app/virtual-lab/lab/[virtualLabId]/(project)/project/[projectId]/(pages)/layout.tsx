'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import VirtualLabTopMenu from '@/components/VirtualLab/VirtualLabTopMenu';
import SideMenu from '@/components/SideMenu';
import VirtualLabProjectSidebar from '@/components/VirtualLab/projects/VirtualLabProjectSidebar';
import useBasePath from '@/hooks/useBasePath';

export default function VirtualLabProjectLayout({ children }: { children: ReactNode }) {
  const [path, current] = useBasePath('project');

  return (
    <div className="inset-0 z-0 mb-10 mr-10 grid h-screen grid-cols-[1fr_3fr] grid-rows-1 overflow-y-scroll bg-primary-9 pr-10 text-white">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="flex flex-row gap-4">
          <SideMenu
            links={[
              {
                key: 'virtual-lab',
                href: '/virtual-lab/lab/test',
                content: (
                  <div className="flex gap-2 font-bold">
                    <span className="text-primary-3">Virtual lab:</span>Institute of Neuroscience
                  </div>
                ),
              },
            ]}
          />

          <VirtualLabProjectSidebar basePath={path} current={current} />
        </div>
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="mt-10">
          <VirtualLabTopMenu />
          {children}
        </div>
      </ErrorBoundary>
    </div>
  );
}
