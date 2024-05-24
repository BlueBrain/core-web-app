'use client';

import { ErrorBoundary } from 'react-error-boundary';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import VirtualLabTopMenu from '@/components/VirtualLab/VirtualLabTopMenu';
import SideMenu from '@/components/SideMenu';
import VirtualLabProjectSidebar from '@/components/VirtualLab/projects/VirtualLabProjectSidebar';
import { LabProjectLayoutProps } from '@/types/virtual-lab/layout';
import { Label, LinkItemKey } from '@/constants/virtual-labs/sidemenu';
import { generateLabUrl } from '@/util/virtual-lab/urls';

export default function VirtualLabProjectLayout({ children, params }: LabProjectLayoutProps) {
  const labUrl = generateLabUrl(params.virtualLabId);

  const labProjectUrl = `${labUrl}/project/${params.projectId}`;
  return (
    <div className="inset-0 z-0 mb-10 mr-10 grid h-screen grid-cols-[1fr_3fr] grid-rows-1 bg-primary-9 pr-10 text-white">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="flex flex-row gap-4">
          <SideMenu
            links={[]}
            lab={{
              key: LinkItemKey.VirtualLab,
              id: params.virtualLabId,
              label: Label.VirtualLab,
              href: `${labUrl}/overview`,
            }}
            project={{
              key: LinkItemKey.Project,
              id: params.projectId,
              virtualLabId: params.virtualLabId,
              label: Label.Project,
              href: `${labProjectUrl}/home`,
            }}
          />

          <VirtualLabProjectSidebar
            virtualLabId={params.virtualLabId}
            projectId={params.projectId}
          />
        </div>
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="mt-10 w-full overflow-hidden">
          <VirtualLabTopMenu />
          {children}
        </div>
      </ErrorBoundary>
    </div>
  );
}
