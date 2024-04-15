'use client';

import { ErrorBoundary } from 'react-error-boundary';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import VirtualLabTopMenu from '@/components/VirtualLab/VirtualLabTopMenu';
import SideMenu from '@/components/SideMenu';
import VirtualLabProjectSidebar from '@/components/VirtualLab/projects/VirtualLabProjectSidebar';
import { LabProjectLayoutProps } from '@/types/virtual-lab/layout';
import { Label, LinkItemKey } from '@/constants/virtual-labs/sidemenu';

export default function VirtualLabProjectLayout({ children, params }: LabProjectLayoutProps) {
  const labUrl = `/virtual-lab/lab/${params.virtualLabId}`;
  const labProjectUrl = `${labUrl}/project/${params.projectId}`;
  return (
    <div className="inset-0 z-0 mb-10 mr-10 grid h-screen grid-cols-[1fr_3fr] grid-rows-1 bg-primary-9 pr-10 text-white">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="flex flex-row gap-4">
          <SideMenu
            links={[
              {
                key: LinkItemKey.Project,
                label: Label.Project,
                href: `${labProjectUrl}/home`,
                content: params.projectId,
              },
            ]}
            lab={{
              key: LinkItemKey.VirtualLab,
              id: params.virtualLabId,
              label: Label.VirtualLab,
              href: labUrl,
              content: params.virtualLabId,
            }}
          />

          <VirtualLabProjectSidebar virtualLabId={params.virtualLabId} projectId={params.projectId} />
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
