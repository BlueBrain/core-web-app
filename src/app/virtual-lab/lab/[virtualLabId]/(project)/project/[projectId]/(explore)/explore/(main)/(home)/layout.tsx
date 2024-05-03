'use client';

import { ErrorBoundary } from 'react-error-boundary';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import VirtualLabTopMenu from '@/components/VirtualLab/VirtualLabTopMenu';
import SideMenu from '@/components/SideMenu';
import VirtualLabProjectSidebar from '@/components/VirtualLab/projects/VirtualLabProjectSidebar';
import { LabProjectLayoutProps } from '@/types/virtual-lab/layout';
import { Role, Label, Content, LinkItemKey } from '@/constants/virtual-labs/sidemenu';
import { generateLabUrl } from '@/util/virtual-lab/urls';

export default function VirtualLabProjectLayout({ children, params }: LabProjectLayoutProps) {
  const labUrl = generateLabUrl(params.virtualLabId);

  const labProjectUrl = `${labUrl}/project/${params.projectId}`;
  return (
    <div className="inset-0 z-0 mb-10 mr-10 grid h-screen grid-cols-[1fr_3fr] grid-rows-1 overflow-y-scroll bg-primary-9 bg-center bg-no-repeat pr-10 text-white bg-blend-lighten [background-size:70%]">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="flex flex-row gap-4">
          <SideMenu
            links={[
              {
                key: LinkItemKey.Explore,
                href: `${labProjectUrl}/explore`,
                content: Content.Explore,
                role: Role.Section,
                styles: ' rounded-full bg-primary-5 py-3 text-primary-9 w-2/3',
              },
            ]}
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
        <div className="mt-10">
          <VirtualLabTopMenu />
          {children}
        </div>
      </ErrorBoundary>
    </div>
  );
}
