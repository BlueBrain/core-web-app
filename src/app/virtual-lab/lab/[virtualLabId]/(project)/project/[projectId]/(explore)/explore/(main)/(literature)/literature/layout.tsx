'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import SideMenu from '@/components/SideMenu';
import { BrainRegionsSidebar } from '@/components/build-section/BrainRegionSelector';
import { useSetBrainRegionFromQuery } from '@/hooks/brain-region-panel';

type LiteratureLayoutProps = {
  children: ReactNode;
  params: {
    virtualLabId: string;
    projectId: string;
  };
};

export default function GenericLayout({ children, params }: LiteratureLayoutProps) {
  useSetBrainRegionFromQuery();

  return (
    <div className="grid h-screen grid-cols-[min-content_min-content_auto] grid-rows-1">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="flex flex-row gap-4">
          <SideMenu
            links={[
              {
                key: 'project',
                label: 'Project',
                href: '/virtual-lab/lab/test/project/test',
                content: params.projectId,
              },
              {
                key: 'explore',
                href: '/virtual-lab/lab/test/project/test/explore',
                content: 'Explore',
              },
              {
                key: 'literature',
                href: '/virtual-lab/lab/test/project/test/literature',
                content: params.projectId,
              },
            ]}
            current="explore"
            lab={{
              key: 'virtualLab',
              label: 'Virtual Lab',
              href: '/virtual-lab/lab/test',
              content: params.virtualLabId,
            }}
          />
        </div>
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <BrainRegionsSidebar />
      </ErrorBoundary>
      <div className="bg-white">{children}</div>
    </div>
  );
}
