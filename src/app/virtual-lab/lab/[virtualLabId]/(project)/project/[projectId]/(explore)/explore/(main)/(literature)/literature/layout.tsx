'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import SideMenu from '@/components/SideMenu';
import { BrainRegionsSidebar } from '@/components/build-section/BrainRegionSelector';
import { useSetBrainRegionFromQuery } from '@/hooks/brain-region-panel';
import { Role, Label, Content, LinkItemKey } from '@/constants/virtual-labs/sidemenu';

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
                key: LinkItemKey.Project,
                label: Label.Project,
                href: '/virtual-lab/lab/test/project/test/home',
                content: params.projectId,
              },
              {
                key: LinkItemKey.Explore,
                href: '/virtual-lab/lab/test/project/test/explore',
                content: Content.Explore,
                role: Role.Section,
                styles: ' rounded-full bg-primary-5 py-3 text-primary-9',
              },
              {
                key: LinkItemKey.Literature,
                href: '/virtual-lab/lab/test/project/test/literature',
                content: Content.Literature,
                role: Role.Current,
                styles: 'text-primary-3',
              },
            ]}
            lab={{
              key: LinkItemKey.VirtualLab,
              label: Label.VirtualLab,
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
