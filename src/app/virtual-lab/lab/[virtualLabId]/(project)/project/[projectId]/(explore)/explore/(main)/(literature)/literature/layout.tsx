'use client';

import { ErrorBoundary } from 'react-error-boundary';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import SideMenu from '@/components/SideMenu';
import { BrainRegionsSidebar } from '@/components/build-section/BrainRegionSelector';
import { useSetBrainRegionFromQuery } from '@/hooks/brain-region-panel';
import { Role, Label, Content, LinkItemKey } from '@/constants/virtual-labs/sidemenu';
import { LabProjectLayoutProps } from '@/types/virtual-lab/layout';
import { basePath } from '@/config';

export default function GenericLayout({ children, params }: LabProjectLayoutProps) {
  useSetBrainRegionFromQuery();

  const labUrl = `${basePath}/virtual-lab/lab/${params.virtualLabId}`;
  const labProjectUrl = `${labUrl}/project/${params.projectId}`;

  return (
    <div className="grid h-screen grid-cols-[min-content_min-content_auto] grid-rows-1">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="flex flex-row gap-4">
          <SideMenu
            links={[
              {
                key: LinkItemKey.Project,
                label: Label.Project,
                href: `${labProjectUrl}/home`,
                content: 'Local test project',
              },
              {
                key: LinkItemKey.Explore,
                href: `${labProjectUrl}/explore`,
                content: Content.Explore,
                role: Role.Section,
                styles: ' rounded-full bg-primary-5 py-3 text-primary-9 w-2/3',
              },
              {
                key: LinkItemKey.Literature,
                href: `${labProjectUrl}/explore/literature`,
                content: Content.Literature,
                role: Role.Current,
                styles: 'text-primary-3',
              },
              {
                key: LinkItemKey.Scale,
                href: `${labProjectUrl}/explore/literature`,
                content: 'single neuron',
                role: Role.Scale,
                label: Label.Scale,
              },
              {
                key: LinkItemKey.ScaleBuild,
                href: `${labProjectUrl}/explore/literature`,
                content: 'build',
                role: Role.Scale,
              },
            ]}
            lab={{
              key: LinkItemKey.VirtualLab,
              id: params.virtualLabId,
              label: Label.VirtualLab,
              href: `${labUrl}/lab`,
              content: 'Test',
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
